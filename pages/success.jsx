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

    const { customer, subscription } = await stripe.checkout.sessions.retrieve(session_id)

    if(!customer || !subscription) return { props: {} }

    const { ended_at, start_date, status, trial_end } = await stripe.subscriptions.retrieve(subscription)
    const { email, phone } = await stripe.customers.retrieve(customer)
    
    await prisma.subscriptions.create({
      data: { user_id: user?.id, customer, subscription, canceled_at, ended_at, start_date, status, trial_end }
    })

    await prisma.user.update({
      where: { 
        email: email.toLowerCase(),
        id: user?.id
      },
      data: { 
        subscription_id: subscription,
        phone,
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