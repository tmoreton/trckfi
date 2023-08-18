// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500)

  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    const accts = await prisma.accounts.groupBy({
      by: ['institution', 'type', 'subtype'],
      where: {
        OR: query,
        active: true,
      },
      _count: {
        amount: true,
      },
      _sum: {
        amount: true,
      },
    })

    let str = ''
    accts.map(i => {
      str += `Bank name: ${i.institution} Account type: ${i.type} ${i.subtype} for ${i._sum.amount}`
    })
    let prompt = `You are a seasoned financial planner, wealth coach, CPA, and former CFO who gives accepts questions from people and gives them unbiased, financial advice in hopes of helping them improve their finances and keep and make more money. You also are very ethical and only give advice that is ethically acceptable. The person who you are giving advice to has given you their current net worth total of ${str}. How much will my investment be worth in 30 years? `

    return res.status(200).json({ status: 'OK', data: prompt})
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}