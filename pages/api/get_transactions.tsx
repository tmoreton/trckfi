// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user, range } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)

  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    let transactions = await prisma.transactions.findMany({
      where: {
        OR: query,
        active: true,
        pending: false,
        authorized_date: {
          lte: range.startDate,
          gte: range.endDate
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
          { detailed_category: 'ACCOUNT_TRANSFER' },
        ],
      },
      include: {
        account: true,
        user: true
      },
      orderBy: {
        date: 'desc',
      },
    })
    // transactions = transactions.filter(t => t.account?.active)

    return res.status(200).json({ data: transactions })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_transactions: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}