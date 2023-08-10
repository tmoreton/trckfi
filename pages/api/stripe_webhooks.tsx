import Stripe from 'stripe'
import getRawBody from 'raw-body'
import prisma from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const rawBody = await getRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log(event)
    switch (event.type) {
      case 'customer.subscription.created':
        await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: true }
        })
        break;
      case 'customer.subscription.deleted':
        await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: false }
        })
        break;
      case 'customer.subscription.paused':
        await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: false }
        })
        break;
      case 'customer.subscription.resumed':
        await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: true }
        })
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.status(200).json({ data: event })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}