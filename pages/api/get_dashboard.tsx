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
    // let activeAccounts = await prisma.accounts.findMany({
    //   where: {
    //     OR: query,
    //     active: true,
    //   },
    //   select: {
    //     id: true,
    //   },
    // })
    // let ids = activeAccounts.map(i => i.id)

    let groupByWeek = await prisma.transactions.groupBy({
      by: ['week_year'],
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          lte: 0
        },
        // account_id: { in: ids },
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
    groupByWeek.sort((a, b) => b.week_year?.split('-')[1] - a.week_year?.split('-')[1])

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
        ],
      },
      _sum: {
        amount: true,
      },
    })

    let recurring = await prisma.transactions.findMany({
      where: {
        OR: query,
        pending: false,
        upcoming_date: {
          gte: startDate
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'asc'
      },
    })

    const uniq = (a) => {
      var seen = {};
      return a.filter(function(item) {
        return seen.hasOwnProperty(item.name) ? false : (seen[item.name] = true);
      });
    }

    let creditPayments = await prisma.transactions.findMany({
      where: {
        OR: query,
        pending: false,
        date: {
          gte: one_month_ago
        },
        primary_category: 'LOAN_PAYMENTS',
        amount: {
          gte: 0
        },
      },
      include: {
        account: true
      },
      orderBy: {
        date: 'asc'
      },
      take: 5,
    })

    return res.status(200).json({ data: {
      categories,
      detailedCategories,
      groupByMonthIncome,
      groupByMonth,
      groupByWeek,
      groupByYearIncome,
      groupByYear,
      yearCategories,
      yearDetailedCategories,
      recurring: uniq(recurring),
      creditPayments,
    }})
  } catch (e) {
    console.error(e)
    slackMessage('Error get_dashboard: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}