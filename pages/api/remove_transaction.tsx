// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { ids } = req.body
  try {
    await prisma.transactions.updateMany({
      where: {
        id: { in: ids }
      },
      data: { 
        active: false,
        user_id: null
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}