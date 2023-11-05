// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { id } = req.body
  if (!id) return res.status(500)
  
  try {
    // @ts-ignore
    await prisma.goals.delete({
      where: {
        id
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_goal: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}