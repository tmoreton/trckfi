// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const startDate = DateTime.now().toISO()
  const one_month_ago = DateTime.now().minus({ months: 1 }).toISO()
  const endDate = DateTime.now().minus({ months: 6 }).startOf('month').toISO()
  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    let groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        amount: {
          gte: 0,
        },
        // account_id: { in: ids },
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
      orderBy: {
        month_year: 'desc'
      },
    })

    let groupByMonth = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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

    let groupByYearIncome = await prisma.transactions.groupBy({
      by: ['year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        amount: {
          gte: 0,
        },
        // account_id: { in: ids },
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
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 12 }).startOf('year').toISO()
        },
      },
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
      orderBy: {
        year: 'desc'
      },
    })

    let groupByYear = await prisma.transactions.groupBy({
      by: ['year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 12 }).startOf('year').toISO()
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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
      _sum: {
        amount: true,
      },
      _count: {
        amount: true,
      },
      orderBy: {
        year: 'desc'
      },
    })
    
    const categories = await prisma.transactions.groupBy({
      by: ['primary_category', 'month_year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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
      _sum: {
        amount: true,
      },
    })

    const detailedCategories = await prisma.transactions.groupBy({
      by: ['detailed_category', 'month_year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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
      _sum: {
        amount: true,
      },
    })

    const yearCategories = await prisma.transactions.groupBy({
      by: ['primary_category', 'year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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
      _sum: {
        amount: true,
      },
    })

    const yearDetailedCategories = await prisma.transactions.groupBy({
      by: ['detailed_category', 'year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0,
        },
        // account_id: { in: ids },
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
      _sum: {
        amount: true,
      },
    })

    return res.status(200).json({ 
      data: {
        categories,
        detailedCategories,
        groupByMonthIncome,
        groupByMonth,
        groupByWeek: [],
        groupByYearIncome,
        groupByYear,
        yearCategories,
        yearDetailedCategories,
      }
    })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_dashboard: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}