// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user, preferences } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Account Info' })
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: preferences
    })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_user: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}