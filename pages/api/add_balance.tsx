// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import Stripe from 'stripe'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user_id} = req.body
  if (!user_id) return res.status(500).json({ error: 'No User' })
  const user = await prisma.user.findUnique({
    where: {
      id: user_id
    }
  })
  // @ts-ignore
  const answers = await prisma.answers.aggregate({
    where: {
      user_id: user.id,
      correct: true,
    },
    _count: {
      correct: true
    }
  })
  let correct_answers = answers?._count?.correct
  if (!correct_answers || correct_answers < 10) return res.status(500).json({ error: 'Not enough points to redeem. Must be in $10 increments.' })

  // @ts-ignore
  const balances = await prisma.balances.aggregate({
    where: {
      user_id: user.id,
      type: 'points',
    },
    _sum: {
      amount: true
    }
  })

  if (Number(balances?._sum?.amount)+100 >= correct_answers) return res.status(500).json({ error: 'Not enough points to redeem. Must be in $10 increments.' })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    })

    if(user.customer_id){
      const balanceTransaction = await stripe.customers.createBalanceTransaction(user.customer_id, { amount: -1000, currency: 'usd' })
      if(balanceTransaction){
        // @ts-ignore
        await prisma.balances.upsert({
          where: { balance_id: balanceTransaction.id },
          update: {},
          create: { 
            balance_id: balanceTransaction.id,
            user_id: user.id,
            customer_id: user.customer_id,
            amount: 10,
            details: balanceTransaction.object,
            type: 'points'
          },
        })
      }
    } else {
      // When a linked user redeems points
      const linked_user = await prisma.user.findUnique({
        where: {
          // @ts-ignore
          id: user.linked_user_id
        }
      })
      const balanceTransaction = await stripe.customers.createBalanceTransaction(linked_user.customer_id, { amount: -1000, currency: 'usd' })
      if(balanceTransaction){
        // @ts-ignore
        await prisma.balances.upsert({
          where: { balance_id: balanceTransaction.id },
          update: {},
          create: { 
            balance_id: balanceTransaction.id,
            user_id: user.id,
            customer_id: linked_user.customer_id,
            amount: 10,
            details: balanceTransaction.object,
            type: 'points'
          },
        })
      }
    }

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_balance: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}