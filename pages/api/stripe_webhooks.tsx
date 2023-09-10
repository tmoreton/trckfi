import Stripe from 'stripe'
import getRawBody from 'raw-body'
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

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
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    // @ts-ignore
    const { customer, status, canceled_at, ended_at, trial_end, plan } = event.data.object
    console.log('event_type: ', event.type)
    console.log('customer_id: ', customer)
    switch (event.type) {
      case 'customer.subscription.updated':
        const updatedUser = await prisma.user.update({
          where: { customer_id: customer },
          data: { 
            active: canceled_at ? false : true,
            status,
            canceled_at,
            ended_at,
            trial_end,
            // @ts-ignore
            product_id: plan.product
          }
        })
        if(updatedUser.linked_user_id){
          if(plan.product === process.env.STRIPE_PRO_SUBSCRIPTION_ID){
            await prisma.user.update({
              where: { id: updatedUser.id },
              data: { linked_user_id: null }
            })
            await prisma.user.update({
              where: { id: updatedUser.linked_user_id },
              data: {
                active: false,
                status : 'unlinked',
                // @ts-ignore
                product_id: null,
                linked_user_id: null
              }
            })
          } else {
            await prisma.user.update({
              where: { id: updatedUser.linked_user_id },
              data: {
                active: canceled_at ? false : true,
                status
              }
            })
          }
        }
        break;
      case 'customer.subscription.created':
        await prisma.user.update({
          where: { customer_id: customer },
          data: { 
            active: true,
            status,
            // @ts-ignore
            product_id: plan.product
          }
        })
        break;
      case 'customer.subscription.deleted':
        const deletedUser = await prisma.user.update({
          where: { customer_id: customer },
          data: { 
            active: false,
            status,
            canceled_at,
            ended_at,
            trial_end,
            // @ts-ignore
            product_id: null,
            subscription_id: null,
          }
        })
        if(deletedUser.linked_user_id){
          await prisma.user.update({
            where: { id: deletedUser.id },
            data: { linked_user_id: null }
          })
          await prisma.user.update({
            where: { id: deletedUser.linked_user_id },
            data: {
              active: false,
              status,
              linked_user_id: null,
            }
          })
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return res.status(200).json({ data: event })
  } catch (e) {
    console.error(e)
    slackMessage('Error stripe_webhook: ' + e.message || e.toString())
    throw new Error(e)
  }
}