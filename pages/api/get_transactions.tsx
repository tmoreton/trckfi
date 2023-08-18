// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user, range } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)

  try {
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
    transactions = transactions.filter(t => t.account?.active)
    
    return res.status(200).json({ data: transactions })

  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}