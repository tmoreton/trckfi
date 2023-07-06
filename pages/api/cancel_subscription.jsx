// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import Stripe from 'stripe'
import plaidClient from '../../utils/plaid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  const { user_id } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      },
    })

    const subscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    if(subscription){
      const plaid = await prisma.plaid.findMany({
        where: {
          user_id: user.id
        },
      })
  
      for (var i in plaid) {        
        await plaidClient.itemRemove({
          access_token: plaid[i].access_token
        })
  
        await prisma.plaid.updateMany({
          where: {
            item_id: plaid[i].item_id
          },
          data: {
            active: false,
          }
        })
  
        await prisma.accounts.updateMany({
          where: {
            item_id: plaid[i].item_id
          },
          data: {
            active: false,
            user_id: null
          }
        })
    
        await prisma.transactions.updateMany({
          where: {
            item_id: plaid[i].item_id
          },
          data: {
            active: false,
            user_id: null,
            transaction_id: null
          }
        })

        await prisma.user.updateMany({
          where: {
            id: user.id
          },
          data: {
            active: false,
            stripeSubscriptionId: null,
          }
        })
      }
    }

    return res.status(200).json('ok')
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
