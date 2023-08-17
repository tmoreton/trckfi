import Stripe from 'stripe'
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'
import { render } from '@react-email/render'
import { new_vision } from '../utils/default-vision'
import nodemailer from 'nodemailer'
import Referral from "../emails/referral_success"

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const { session_id, referral_id } = context.query
  const session = await getSession(context)
  const user = session?.user

  if (session_id){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    const { customer, subscription } = await stripe.checkout.sessions.retrieve(session_id)

    if(!customer || !subscription) return { props: {} }

    const { ended_at, start_date, status, trial_end, canceled_at } = await stripe.subscriptions.retrieve(subscription)
    const { email, phone } = await stripe.customers.retrieve(customer)
    
    if(referral_id){
      const referral_user = await prisma.user.findUnique({
        where: { referral_id },
      })
      if(referral_user){
        const balanceTransaction = await stripe.customers.createBalanceTransaction(referral_user.customer_id, { amount: -1000, currency: 'usd' })

        if(balanceTransaction){
          await prisma.balances.upsert({
            where: { balance_id: balanceTransaction.id },
            update: {},
            create: { 
              balance_id: balanceTransaction.id,
              user_id: referral_user.id,
              customer_id: balanceTransaction.customer,
              amount: 10,
              details: balanceTransaction.object
            },
          })

          const message = {
            from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
            to: referral_user.email,
            subject: `Success! You Referred a Friend to Trckfi.`,
            text: '',
            html: render(<Referral />),
          }
      
          let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            secure: false,
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD,
            },
          })
      
          await transporter.sendMail(message)
        }
      }
    }

    await prisma.preferences.upsert({
      where: { user_id: user.id },
      update: { user_id: user.id },
      create: { 
        user_id: user.id,
        vision_board: JSON.parse(new_vision)
      },
    })

    await prisma.user.update({
      where: { 
        email: email.toLowerCase(),
        id: user?.id
      },
      data: { 
        subscription_id: subscription,
        customer_id: customer,
        referral_id: email?.toLowerCase()?.split('@')?.[0],
        canceled_at, 
        ended_at, 
        start_date, 
        status, 
        trial_end,
        phone,
        active: true,
        login_count: {
          increment: 1,
        },
      }
    })
    
    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }

  if(user && user?.active){
    await prisma.user.update({
      where: { 
        id: user.id
      },
      data: { 
        login_count: {
          increment: 1,
        },
      }
    })
    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: '/signup',
      permanent: false,
    },
  }
}