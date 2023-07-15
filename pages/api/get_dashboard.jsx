// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";
// import yahooFinance from 'yahoo-finance2';

export default async (req, res) => {
  const { user, range } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  try {
    // const { regularMarketPrice, currency, shortName } = await yahooFinance.quote('AAPL');
    const groupByWeek = await prisma.transactions.groupBy({
      by: ['week_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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
        week_year: 'asc'
      },
    })
    groupByWeek.sort((a, b) => b.week_year.split('-')[1] - a.week_year.split('-')[1])

    const accounts = await prisma.accounts.findMany({
      where: { 
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true
      },
    })

    let groupByMonthIncome = []
    groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        primary_category: 'INCOME',
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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

    let groupByMonth = []
    groupByMonth = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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
    
    const categories = await prisma.transactions.groupBy({
      by: ['primary_category'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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
    })

    const detailedCategories = await prisma.transactions.groupBy({
      by: ['detailed_category'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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
    })

    const emojiCategories = await prisma.transactions.groupBy({
      by: ['unified'],
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
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
    })
  
    const transactions = await prisma.transactions.findMany({
      where: {
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
        ],
      },
      select: {
        id: true,
        name: true,
        primary_category: true,
        detailed_category: true,
        item_id: true,
        amount: true,
        active: true,
        date: true,
        unified: true,
        notes: true,
        alert_date: true
      },
      orderBy: {
        date: 'desc'
      },
    })   

    const stats = {
      lastMonthTotal: groupByMonth[1]?._sum?.amount,
      thisMonthTotal: groupByMonth[0]?._sum?.amount,
      thisMonthString: DateTime.now().minus({ months: 1 }).startOf('month').monthLong,
      lastMonthString: DateTime.now().minus({ months: 2 }).startOf('month').monthLong,
      lastMonthIncome: groupByMonthIncome[1]?._sum?.amount,
      thisMonthIncome: groupByMonthIncome[0]?._sum?.amount,
    }
    
    return res.status(200).json({ 
      stats, 
      accounts, 
      transactions, 
      categories,
      detailedCategories,
      groupByMonthIncome,
      groupByMonth,
      groupByWeek,
      emojiCategories
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}