// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500)
  const startDate = DateTime.now().startOf('month').toISO()
  const endDate = DateTime.now().minus({ months: 3 }).startOf('month').toISO()

  try {
    const income = await prisma.transactions.groupBy({
      by: ['name', 'primary_category', 'detailed_category'],
      where: {
        OR: [
          { user_id: user.id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
        amount: {
          gte: 0,
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
      _count: {
        amount: true,
      },
      _sum: {
        amount: true,
      },
    })
    let income_str = ''
    income.map(i => {
      income_str += `Name: ${i.name} Category: ${i.detailed_category} with ${i._count.amount} for ${i._sum.amount}`
    })

    const expenses = await prisma.transactions.groupBy({
      by: ['name', 'primary_category', 'detailed_category'],
      where: {
        OR: [
          { user_id: user.id },
          { user_id: user?.linked_user_id },
        ],
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
      _count: {
        amount: true,
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'asc',
        },
      },
      take: 50
    })

    let str = ''
    expenses.map(i => {
      str += `Name: ${i.name} Category: ${i.detailed_category} with ${i._count.amount} for ${i._sum.amount}`
    })

    const accts = await prisma.accounts.groupBy({
      by: ['institution', 'name', 'type', 'subtype'],
      where: {
        OR: [
          { user_id: user.id },
          { user_id: user?.linked_user_id },
        ],
        active: true,
      },
      _count: {
        amount: true,
      },
      _sum: {
        amount: true,
      },
    })

    let acct_str = ''
    accts.map(i => {
      acct_str += `Bank name: ${i.institution} Asset Name: ${i.name} Account type: ${i.type} ${i.subtype} for ${i._sum.amount}`
    })

    let prompt = `You are a seasoned financial planner, wealth coach, CPA, and former CFO who gives accepts questions from people and gives them unbiased, financial advice in hopes of helping them improve their finances and keep and make more money. You also are very ethical and only give advice that is ethically acceptable. The person who you are giving advice to has given you their expense history over the last 3 months spending ${str} with a total Income over the last 3 months of ${income_str}. The person who you are giving advice to has given you their current net worth total of ${acct_str}.`

    return res.status(200).json({ status: 'OK', data: prompt})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}