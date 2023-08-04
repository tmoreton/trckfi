// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)

  try {
    const account_balance = await prisma.accounts.aggregate({
      where: { 
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        // @ts-ignore
        OR: [
          { type: 'credit' },
          { type: 'depository' },
        ],
      },
      _sum: {
        amount: true,
      },
    })

    let groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO()
        },
        amount: {
          gte: 0,
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
      orderBy: {
        month_year: 'desc'
      },
    })

    let groupByMonth = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO()
        },
        amount: {
          lte: 0,
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
      orderBy: {
        month_year: 'desc'
      },
    })
    console.log(groupByMonth)

    let this_month = DateTime.now().startOf('month')
    let last_month = DateTime.now().minus({ months: 1 }).startOf('month')
    let thisMonthTotal = groupByMonth.find(m => m.month_year === this_month.toFormat('yyyy-LL'))
    let lastMonthTotal = groupByMonth.find(m => m.month_year === last_month.toFormat('yyyy-LL'))
    let thisMonthIncome = groupByMonthIncome.find(m => m.month_year === this_month.toFormat('yyyy-LL'))
    let lastMonthIncome = groupByMonthIncome.find(m => m.month_year === last_month.toFormat('yyyy-LL'))
    
    const stats = {
      lastMonthTotal: lastMonthTotal?._sum?.amount || 0,
      thisMonthTotal: thisMonthTotal?._sum?.amount || 0,
      thisMonthString: this_month.monthLong,
      lastMonthString: last_month.monthLong,
      lastMonthIncome: lastMonthIncome?._sum?.amount || 0,
      thisMonthIncome: thisMonthIncome?._sum?.amount || 0,
      accountBalance: account_balance._sum?.amount
    }

    return res.status(200).json({ stats })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}