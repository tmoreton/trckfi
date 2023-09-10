// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user, item } = req.body
  if (!user || !item) return res.status(500).json({ error: 'No User or Payload Info' })
  try {
    await prisma.recurring.update({
      where: { 
        stream_id: item.stream_id
      },
      data: {
        // @ts-ignore
        active: false
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}