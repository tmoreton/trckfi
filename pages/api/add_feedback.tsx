// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const data = req.body
  if (!data ) return res.status(500).json({ error: 'No feedback Info' })
  try {
    // @ts-ignore
    await prisma.customerFeedback.create({ data })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_feedback: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}