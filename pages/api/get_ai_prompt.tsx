// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500)
  const startDate = DateTime.now().startOf('month').toISO()
  const endDate = DateTime.now().minus({ months: 3 }).startOf('month').toISO()

  try {
    const detailedCategories = await prisma.transactions.groupBy({
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
    detailedCategories.map(i => {
      str += `Name: ${i.name} Category: ${i.detailed_category} with ${i._count.amount} for ${i._sum.amount}`
    })
    console.log(str)
    let prompt = `You are a seasoned financial planner, wealth coach, CPA, and former CFO who gives accepts questions from people and gives them unbiased, financial advice in hopes of helping them improve their finances and keep and make more money. You also are very ethical and only give advice that is ethically acceptable. The person who you are giving advice to has given you their expense history over the last 3 months spending ${str}`

    return res.status(200).json({ status: 'OK', data: prompt})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}