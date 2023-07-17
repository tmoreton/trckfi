// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import Stripe from 'stripe'
import plaidClient from '../../utils/plaid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default async (req, res) => {
  // let body;
  // if(typeof req.body === 'object'){
  //   body = req.body
  // } else {
  //   body = JSON.parse(req.body)
  // }
  // let { user_id } = body
  let { user_id } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      },
    })

    await stripe.subscriptions.cancel(user.subscription_id);
    
    const plaid = await prisma.plaid.findMany({
      where: {
        user_id: user.id
      },
    })

    for (var i in plaid) {        
      await plaidClient.itemRemove({ access_token: plaid[i].access_token })

      await prisma.plaid.updateMany({
        where: {
          item_id: plaid[i].item_id
        },
        data: {
          active: false,
        }
      })

      await prisma.user.updateMany({
        where: {
          id: user.id
        },
        data: {
          active: false,
          // @ts-ignore
          subscription_id: null,
        }
      })
    }

    return res.status(200).json('ok')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
