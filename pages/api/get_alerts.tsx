// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500)

  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    const alerts = await prisma.transactions.findMany({
      where: {
        OR: query,
        active: true,
        pending: false,
        alert_date: {
          not: null
        }
      },
      orderBy: {
        alert_date: 'desc'
      },
    })
  
    return res.status(200).json({ status: 'OK', data: alerts})
  } catch (e) {
    console.error(e)
    slackMessage('Error get_alerts: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}