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
    console.log(DateTime.now().minus({ months: 1 }).startOf('month').toISO())

    let groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        primary_category: 'INCOME',
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO()
        },
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
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
          { primary_category: 'INCOME' }
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
    const stats = {
      lastMonthTotal: groupByMonth[1]?._sum?.amount,
      thisMonthTotal: groupByMonth[0]?._sum?.amount,
      thisMonthString: DateTime.now().startOf('month').monthLong,
      lastMonthString: DateTime.now().minus({ months: 1 }).startOf('month').monthLong,
      lastMonthIncome: groupByMonthIncome[1]?._sum?.amount,
      thisMonthIncome: groupByMonthIncome[0]?._sum?.amount,
      accountBalance: account_balance._sum?.amount
    }
    
    return res.status(200).json({ stats })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}