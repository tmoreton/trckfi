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
    switch (event.type) {
      case 'customer.subscription.updated':
        // @ts-ignore
        const { customer, status, canceled_at, ended_at, trial_end } = event.data.object
        const updatedUser = await prisma.user.update({
          where: { customer_id: customer },
          data: { 
            active: canceled_at ? false : true,
            status,
            canceled_at,
            ended_at,
            trial_end
          }
        })
        if(updatedUser.linked_user_id){
          await prisma.user.update({
            // @ts-ignore
            where: { id: updatedUser.linked_user_id },
            data: {
              active: canceled_at ? false : true,
              status,
              canceled_at,
              ended_at,
              trial_end
            }
          })
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.status(200).json({ data: event })
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}