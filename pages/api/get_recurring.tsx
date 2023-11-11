// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'
import { DateTime } from "luxon"

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
  const startDate = DateTime.now().startOf('month').minus({ days: '5' }).toISO()
  const endDate = DateTime.now().endOf('month').plus({ days: '5' }).toISO()
  console.log(startDate)
  console.log(endDate)
  try {
    let recurringTransaction = await prisma.transactions.findMany({
      where: {
        OR: user_query,
        pending: false,
        active: true,
        upcoming_date: {
          gte: startDate,
          lte: endDate
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
        ],
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'asc'
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
        OR: user_query,
        pending: false,
        upcoming_date: {
          gte: startDate,
          lte: endDate
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
      },
    })
    const recurring = creditPayments.concat(uniq(recurringTransaction));


    return res.status(200).json({ status: 'ok', recurring })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}