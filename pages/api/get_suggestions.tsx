// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user, timeframe } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const startDate = DateTime.now().toISO()
  const endDate = DateTime.now().minus({ months: timeframe }).toISO()
  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    let groupByMonthIncome = await prisma.transactions.aggregate({
      where: {
        OR: query,
        active: true,
        amount: {
          gte: 0,
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
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
    })
    let income = Number(groupByMonthIncome._sum.amount)/Number(timeframe)

    let groupByMonthExpenses = await prisma.transactions.aggregate({
      where: {
        OR: query,
        active: true,
        amount: {
          lte: 0,
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
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
    })
    let expenses = Number(groupByMonthExpenses._sum.amount)/Number(timeframe)

    // @ts-ignore
    const goals = await prisma.goals.findMany({
      where: {
        OR: query,
      },
    })    

    let goal_total = 0
    goals.forEach(goal => {
      let goal_amount = Number(goal.amount) - Number(goal.current_amount)
      let difference = DateTime.fromISO(goal.date).diff(DateTime.now(), ['months']).toObject()
      goal_total += Number(goal_amount)/Number(difference.months)
    })
    
    return res.status(200).json({ data: {
      timeframe,
      expenses,
      income,
      goals: goal_total,
      recurring: 0
    }})
  } catch (e) {
    console.error(e)
    slackMessage('Error get_dashboard: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}