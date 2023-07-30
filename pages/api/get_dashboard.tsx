// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user, range } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)

  try {
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
        amount: {
          lte: 0,
        },
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
        OR: [
          { user_id: user_id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        amount: {
          gte: 0,
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
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

    let groupByMonth = await prisma.transactions.groupBy({
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
        amount: {
          lte: 0,
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
        amount: {
          lte: 0,
        },
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
        amount: {
          lte: 0,
        },
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
        amount: {
          lte: 0,
        },
      },
      _sum: {
        amount: true,
      },
    })
  
    let transactions = await prisma.transactions.findMany({
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
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'desc'
      },
    })
    // Need to account for transactions with no account
    // transactions = transactions.filter(t => t.account.active)
    
    return res.status(200).json({ 
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