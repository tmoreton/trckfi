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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });
  
  if (session_id){
    const stripe_session = await stripe.checkout.sessions.retrieve(session_id)
    const { customer, subscription, canceled_at, current_period_end, current_period_start, ended_at, start_date, status, trial_end } = stripe_session

    if(!customer || !subscription) return { props: { newUser: false } }

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
        active: true
      }
    })
    return {
      redirect: {
        destination: '/dashboard?new_user=true',
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