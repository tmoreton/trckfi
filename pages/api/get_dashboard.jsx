// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id, range } = req.body
  if (!user_id ) return res.status(500)
  try {

    // const groupByWeek = await prisma.transactions.groupBy({
    //   by: ['week_year'],
    //   where: {
    //     user_id: user_id,
    //     active: true,
    //     authorized_date: {
    //       lte: range.startDate,
    //       gte: range.endDate
    //     },
    //     NOT: [
    //       { primary_category: 'LOAN_PAYMENTS' },
    //       { primary_category: 'TRANSFER_IN' },
    //       { primary_category: 'TRANSFER_OUT' },
    //       { primary_category: 'INCOME' }
    //     ],
    //   },
    //   _sum: {
    //     amount: true,
    //   },
    //   _count: {
    //     amount: true,
    //   },
    //   orderBy: {
    //     week_year: 'desc'
    //   },
    // })

    const accounts = await prisma.accounts.findMany({
      where: { 
        user_id: user_id,
        active: true
      },
    })

    let groupByMonthIncome = []
    groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        user_id: user_id,
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
        user_id: user_id,
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
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' }
        ],
      },
      _sum: {
        amount: true,
      },
    })

    const detailedCategories = await prisma.transactions.groupBy({
      by: ['detailed_category'],
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' }
        ],
      },
      _sum: {
        amount: true,
      },
    })
  
    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
        },
        // emoji: {
        //   not: null
        // },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
        ],
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
      // groupByWeek
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}