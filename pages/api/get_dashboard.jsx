// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id, range } = req.body
  if (!user_id ) return res.status(500)

  const defaultData = { 
    stats: {
      lastMonthTotal: 0,
      thisMonthTotal: 0,
      thisMonthString: DateTime.now().minus({ months: 1 }).startOf('month').monthLong,
      lastMonthString: DateTime.now().minus({ months: 2 }).startOf('month').monthLong,
      lastMonthIncome: 0,
      thisMonthIncome: 0
    }, 
    accounts: [], 
    transactions: [], 
    categories: [], 
    monthlyIncomeData: [], 
    monthlyExpenseData: [], 
    recurring: [] 
  }

  try {
    const accounts = await prisma.accounts.findMany({
      where: { 
        user_id: user_id,
        active: true
      },
    })

    if(accounts.length <= 0) return res.status(200).json(defaultData)
    
    const lastMonthIncome = await prisma.transactions.aggregate({
      where: {
        user_id: user_id,
        authorized_date: {
          lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
        },
        primary_category: 'INCOME'
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
    })
  
    const thisMonthIncome = await prisma.transactions.aggregate({
      where: {
        user_id: user_id,
        authorized_date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        primary_category: 'INCOME'
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
    })
  
    const lastMonth = await prisma.transactions.aggregate({
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
          { primary_category: 'INCOME' },
        ],
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
    })
    
    const thisMonth = await prisma.transactions.aggregate({
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
          { primary_category: 'INCOME' },
        ],
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
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

    const monthlyIncomeData = await prisma.transactions.groupBy({
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
      orderBy: {
        month_year: 'asc'
      },
    })

    const monthlyExpenseData = await prisma.transactions.groupBy({
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
          { primary_category: 'INCOME' },
        ],
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        month_year: 'asc'
      },
    })

    const recurring1 = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
          { primary_category: 'INCOME' }
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    const recurring2 = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        active: true,
        authorized_date: {
          lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
          { primary_category: 'INCOME' }
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    let recurring = []
    recurring1.forEach((month1) => {
      let tarObj = recurring2.find((obj) => {
        return month1.amount === obj.amount && month1.name === obj.name;
      })
      if(tarObj){
        recurring.push(tarObj)
      }
    })
    
    const stats = {
      lastMonthTotal: lastMonth._sum.amount,
      thisMonthTotal: thisMonth._sum.amount,
      thisMonthString: DateTime.now().minus({ months: 1 }).startOf('month').monthLong,
      lastMonthString: DateTime.now().minus({ months: 2 }).startOf('month').monthLong,
      lastMonthIncome: lastMonthIncome._sum.amount,
      thisMonthIncome: thisMonthIncome._sum.amount
    }

    return res.status(200).json({ stats, accounts, transactions, categories, monthlyIncomeData, monthlyExpenseData, recurring, detailedCategories, range })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}