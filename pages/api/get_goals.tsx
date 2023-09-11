// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500)
  
  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    // @ts-ignore
    const goals = await prisma.goals.findMany({
      where: {
        OR: query,
      },
    })
    return res.status(200).json({ status: 'OK', data: goals })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_accounts: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}