import Congrats from '../components/congrats'
import Stripe from 'stripe';
import { useSession, signIn } from "next-auth/react"
import prisma from '../lib/prisma';

export default function ({ data }) {
  const { data: session } = useSession()
  if (!data) {
    return (
      <button onClick={() => signIn()} className="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        Login
      </button>
    )
  }
  return <Congrats/>
}
 
// This gets called on every request
export async function getServerSideProps(context) {
  const { session_id } = context.query;
  if (session_id){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
    // Fetch data from external API
    const { customer }  = await stripe.checkout.sessions.retrieve(session_id);
    const data = await stripe.customers.retrieve(customer)
    const { id, email, name, phone } = data

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { 
        email: email.toLowerCase(),
        stripeId: id,
        name,
        phone,
        isActive: true
      },
    })

    return { props: { data: user } }
  }
}