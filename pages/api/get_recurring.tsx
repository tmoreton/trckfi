// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'
import { DateTime } from "luxon"

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    let recurringTransaction = await prisma.transactions.findMany({
      where: {
        OR: query,
        pending: false,
        active: true,
        upcoming_date: {
          gte: DateTime.now().startOf('month').minus({ days: '5' }).toISO()
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
          { 
            name: {
              contains: 'transfer',
              mode: 'insensitive'
            }
          },
        ],
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'asc'
      },
    })

    let upcomingTransactions = await prisma.transactions.findMany({
      where: {
        OR: query,
        pending: false,
        active: true,
        upcoming_date: {
          gte: DateTime.now().toISO()
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
          { 
            name: {
              contains: 'transfer',
              mode: 'insensitive'
            }
          },
        ],
      },
      include: {
        account: true
      },
      orderBy: {
        upcoming_date: 'asc'
      },
    })

    const uniq = (a) => {
      var seen = {};
      return a.filter(function(item) {
        return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true)
      });
    }

    let creditPayments = await prisma.transactions.findMany({
      where: {
        OR: query,
        pending: false,
        date: {
          gte: DateTime.now().minus({ months: 1 }).toISO()
        },
        primary_category: 'LOAN_PAYMENTS',
        amount: {
          gte: 0
        },
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    return res.status(200).json({ status: 'ok',
      recurring: uniq(recurringTransaction),
      creditPayments,
      all: creditPayments.concat(uniq(recurringTransaction)),
      upcomingRecurring: uniq(upcomingTransactions).splice(0, 6)
    })
    
  } catch (e) {
    console.error(e)
    slackMessage('Error get_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}