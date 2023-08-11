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
        const userCreated = await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: true }
        })
        if(userCreated.linked_user_id){
          await prisma.user.update({
            // @ts-ignore
            where: { id: userCreated.linked_user_id },
            data: { active: true }
          })
        }
        break;
      case 'customer.subscription.deleted':
        const userDeleted = await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: false }
        })
        if(userDeleted.linked_user_id){
          await prisma.user.update({
            // @ts-ignore
            where: { id: userDeleted.linked_user_id },
            data: { active: false }
          })
        }
        break;
      case 'customer.subscription.paused':
        const userPaused = await prisma.user.update({
          // @ts-ignore
          where: { customer_id: event.data.object?.customer },
          data: { active: false }
        })
        if(userPaused.linked_user_id){
          await prisma.user.update({
            // @ts-ignore
            where: { id: userPaused.linked_user_id },
            data: { active: false }
          })
        }
        break;
      case 'customer.subscription.updated':
        // @ts-ignore
        const { customer, status, canceled_at, ended_at, trial_end } = event.data.object
        const updatedUser = await prisma.user.update({
          where: { customer_id: customer },
          data: { 
            active: ended_at ? false : true,
            status,
            canceled_at,
            ended_at,
            trial_end
          }
        })
        if(updatedUser.linked_user_id){
          await prisma.user.update({
            // @ts-ignore
            where: { id: userResumed.linked_user_id },
            data: {
              active: ended_at ? false : true,
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
    return res.status(500).json({ error: error.message || error.toString() })
  }
}