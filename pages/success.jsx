import Stripe from 'stripe'
import prisma from '../lib/prisma'
import { getSession } from 'next-auth/react'

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const { session_id } = context.query
  const session = await getSession(context)
  const user = session?.user
  
  if (session_id){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    const stripe_session = await stripe.checkout.sessions.retrieve(session_id)
    console.log(stripe_session)
    const { customer, subscription, canceled_at, current_period_end, current_period_start, ended_at, start_date, status, trial_end } = stripe_session

    if(!customer || !subscription) return { props: {} }

    const data = await stripe.customers.retrieve(customer)
    const { email, phone, name } = data
    
    await prisma.subscriptions.create({
      data: { user_id: user?.id, customer, subscription, canceled_at, current_period_end, current_period_start, ended_at, start_date, status, trial_end }
    })

    await prisma.user.update({
      where: { 
        email: email.toLowerCase(),
        id: user?.id
      },
      data: { 
        subscription_id: subscription,
        phone,
        name,
        active: true,
        loginCount: {
          increment: 1,
        },
      }
    })
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  if(user && user.active){
    await prisma.user.update({
      where: { 
        id: user.id
      },
      data: { 
        loginCount: {
          increment: 1,
        },
      }
    })
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: '/getting-started',
      permanent: false,
    },
  }
}