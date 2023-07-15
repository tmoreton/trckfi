import Stripe from 'stripe'
import prisma from '../lib/prisma'

export default function () {
  return null
}

export async function getServerSideProps(context) {
  const { session_id } = context.query

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });
  
  if (session_id){
    const session = await stripe.checkout.sessions.retrieve(session_id)
    console.log(session)
    const { customer, subscription, canceled_at, current_period_end, current_period_start, ended_at, start_date, status, trial_end } = session
    if(!customer || !subscription) return { props: { newUser: false } }

    const data = await stripe.customers.retrieve(customer)
    const { email, phone, name } = data
    
    await prisma.subscriptions.create({
      data: { customer, subscription, canceled_at, current_period_end, current_period_start, ended_at, start_date, status, trial_end }
    })

    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
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