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
    const { customer, subscription } = await stripe.checkout.sessions.retrieve(session_id)
    if(!customer || !subscription) return { props: { newUser: false } }

    const data = await stripe.customers.retrieve(customer)
    const { email, phone, name } = data

    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        stripeCustomerId: customer,
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