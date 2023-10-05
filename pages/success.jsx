import Stripe from 'stripe'
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'
import { render } from '@react-email/render'
import nodemailer from 'nodemailer'
import Referral from "../emails/referral_success"
import slackMessage from '../utils/slackMessage'
import { getCsrfToken } from "next-auth/react"
import { useState, useEffect } from 'react'
import CheckEmail from '../components/check-email'
import LoadingModal from '../components/modals/loading-modal'

export default function ({ email, csrfToken }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(email){
      handleSubmit()
    }
  }, [email, csrfToken])

  const handleSubmit = async () => {
    setLoading(false)
    const res = await fetch(`/api/auth/signin/email?callbackUrl=${process.env['NEXT_PUBLIC_BASE_URL']}/signin-success`, {
      body: JSON.stringify({ 
        email,
        csrfToken
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  return loading ? <LoadingModal refreshing={loading} text='Creating your Account...'/> : <CheckEmail email={email} active={true} text="You successfully signed up! 🎉 Let's get ready to tackle our finances!"/>
}

export async function getServerSideProps(context) {
  const { session_id } = context.query
  const session = await getSession(context)
  const csrfToken = await getCsrfToken(context)
  const user = session?.user

  if(user){
    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }

  if (session_id){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    const { customer, subscription } = await stripe.checkout.sessions.retrieve(session_id)

    if(!customer || !subscription) return { props: {} }

    const { ended_at, start_date, status, trial_end, canceled_at } = await stripe.subscriptions.retrieve(subscription)
    const { email, phone } = await stripe.customers.retrieve(customer)
    
    const stripe_data = {
      email,
      subscription_id: subscription,
      customer_id: customer,
      canceled_at, 
      ended_at, 
      start_date, 
      status, 
      trial_end,
      phone,
      active: true,
      login_count: 0,
    }

    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: stripe_data,
      create: stripe_data
    })
    
    slackMessage(`${email} Signed Up`)

    if(context.query?.referral_id){
      let referral_user = await prisma.user.findUnique({
        where: { referral_id: context.query?.referral_id },
      })

      if(!referral_user?.customer_id){
        referral_user = await prisma.user.findUnique({
          where: { id: referral_user?.linked_user_id },
        })
      }
      
      const referral = await prisma.referrals.findUnique({
        where: { referred_email: email },
      })

      if(referral_user && !referral){
        const balanceTransaction = await stripe.customers.createBalanceTransaction(referral_user.customer_id, { amount: -1000, currency: 'usd' })

        if(balanceTransaction){
          await prisma.referrals.upsert({
            where: { referred_email: email },
            update: {},
            create: { 
              user_id: referral_user.id,
              customer_id: balanceTransaction.customer,
              amount: 10,
              referred_customer_id: customer,
              referred_email: email
            },
          })

          await prisma.balances.upsert({
            where: { balance_id: balanceTransaction.id },
            update: {},
            create: { 
              balance_id: balanceTransaction.id,
              user_id: referral_user.id,
              customer_id: balanceTransaction.customer,
              amount: 10,
              details: balanceTransaction.object,
              type: 'referral'
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
            host: process.env.SMTP_HOST,
            secure: false,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          })
      
          await transporter.sendMail(message)
        }
      }
    }
    
    // Successfully created new user
    return {
      props: { email, csrfToken },
    }
  }

  // No checkout so redirect to pricing
  return {
    redirect: {
      destination: '/pricing',
      permanent: false,
    },
  }
}