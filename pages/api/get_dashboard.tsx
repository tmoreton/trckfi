// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id } = req.body
  if (!user_id ) return res.status(500)

  try { 
    const plaid = await prisma.plaid.findMany({
      where: { user_id: user_id },
    })

    const thisMonth = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' }
        ],
      },
      orderBy: {
        authorized_date: 'desc'
      }
    })

    const aggregate = await prisma.transactions.groupBy({
      by: ['primary_category'],
      where: {
        user_id: user_id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().startOf('month').toISO(),
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

    const lastMonth = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const thisWeek = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().startOf('week').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const lastWeek = await prisma.transactions.findMany({
      where: {
        user_id: user_id,
        date: {
          lte: DateTime.now().startOf('week').toISO(),
          gte: DateTime.now().minus({ week: 1 }).startOf('week').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const accounts = await prisma.accounts.findMany({
      where: { 
        user_id: user_id,
        active: true
      },
    })

    return res.status(200).json({ thisMonth, lastMonth, thisWeek, lastWeek, accounts, plaid })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}