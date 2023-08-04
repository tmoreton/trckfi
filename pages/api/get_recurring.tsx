// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  let { user } = req.body

  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user

  let linked_user = null
  if(linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
  }
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    const recurring1 = await prisma.transactions.findMany({
      where: {
        OR: user_query,
        active: true,
        authorized_date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    const recurring2 = await prisma.transactions.findMany({
      where: {
        OR: user_query,
        active: true,
        authorized_date: {
          lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    recurring1.forEach(async (month1) => {
      let tarObj = recurring2.find((obj) => {
        return month1.name === obj.name;
      })
      if(tarObj){
        await prisma.transactions.update({
          where: { 
            id: tarObj.id
          },
          data: { 
            recurring: true
          }
        })
      }
    })

    return res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}