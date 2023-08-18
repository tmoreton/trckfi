// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  let { user } = req.body

  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user
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

    recurring1.forEach((month1) => {
      recurring2.forEach(async (month2) => {
        if(month1.name === month2.name && Number(month1.amount) === Number(month2.amount)){
          await prisma.transactions.updateMany({
            where: { 
              OR: [{ id: month1.id }, { id: month2.id }]
            },
            data: { 
              recurring: true
            }
          })
        }
      })
    })

    const duplicates = await prisma.transactions.findMany({
      where: {
        OR: user_query, 
        active: true,
        detailed_category: 'ACCOUNT_TRANSFER',
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ weeks: 1 }).toISO(),
        },
      },
      select: {
        id: true,
        amount: true
      }
    })
    
    let duplicateIds = []
    duplicates.forEach(item => {
      let found = duplicates.find(e=> Math.abs(Number(e.amount)) === Math.abs(Number(item.amount)) && e.id !== item.id)
      if(found){
        duplicateIds.push(found.id)
      }
    })

    await prisma.transactions.updateMany({
      where: {
        id: {
          in: duplicateIds,
        },
      },
      data: {
        active: false,
      },
    })
    
    return res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}