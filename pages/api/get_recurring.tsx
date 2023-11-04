// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { user } = req.body

  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    const recurring = await prisma.recurring.findMany({
      where: {
        OR: user_query,
        is_active: true,
        // @ts-ignore
        active: true,
      },
      include: {
        account: true,
      },
      orderBy: [{
        upcoming_date: 'asc',
      }],
    })

    let monthly_expense = await prisma.recurring.aggregate({
      where: {
        OR: user_query,
        is_active: true,
        // @ts-ignore
        last_amount: {
          lte: 0,
        },
        active: true,
        frequency: 'MONTHLY',
        NOT: [{ detailed_category: 'CREDIT_CARD_PAYMENT' }],
      },
      _sum: {
        last_amount: true,
      },
    })

    let monthly_income = await prisma.recurring.aggregate({
      where: {
        OR: user_query,
        is_active: true,
        // @ts-ignore
        last_amount: {
          gte: 0,
        },
        active: true,
        frequency: 'MONTHLY',
        NOT: [{ detailed_category: 'CREDIT_CARD_PAYMENT' }],
      },
      _sum: {
        last_amount: true,
      },
    })

    return res.status(200).json({ status: 'ok', recurring, monthly_expense, monthly_income })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}