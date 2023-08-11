// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"

export default async (req, res) => {
  const { user, range } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const startDate = DateTime.now().toISO()
  const endDate = DateTime.now().minus({ months: 6 }).startOf('month').toISO()
  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    const groupByWeek = await prisma.transactions.groupBy({
      by: ['week_year'],
      where: {
        OR: query,
        active: true,
        authorized_date: {
          lte: startDate,
          gte: endDate
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
        week_year: 'asc'
      },
    })
    // @ts-ignore
    groupByWeek.sort((a, b) => b.week_year.split('-')[1] - a.week_year.split('-')[1])

    let groupByMonthIncome = await prisma.transactions.groupBy({
      by: ['month_year'],
      where: {
        OR: query,
        active: true,
        amount: {
          gte: 0,
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
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
        authorized_date: {
          lte: startDate,
          gte: endDate
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
    
    const categories = await prisma.transactions.groupBy({
      by: ['primary_category'],
      where: {
        OR: query,
        active: true,
        authorized_date: {
          lte: startDate,
          gte: endDate
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
    })

    const detailedCategories = await prisma.transactions.groupBy({
      by: ['detailed_category'],
      where: {
        OR: query,
        active: true,
        authorized_date: {
          lte: startDate,
          gte: endDate
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
    })

    const emojiCategories = await prisma.transactions.groupBy({
      by: ['unified'],
      where: {
        OR: query,
        active: true,
        authorized_date: {
          lte: startDate,
          gte: endDate
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
    })
    
    return res.status(200).json({ data: {
      categories,
      detailedCategories,
      groupByMonthIncome,
      groupByMonth,
      groupByWeek,
      emojiCategories
    }})

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}