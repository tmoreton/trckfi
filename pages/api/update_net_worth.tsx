// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'
import { client } from "../../trigger";

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Account Info' })

  const { id, linked_user_id } = user
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    const plaid = await prisma.plaid.findMany({
      where: {
        OR: query,
        active: true
      },
    })
    
    for (let p in plaid) {
      await client.sendEvent({
        name: "sync.plaid",
        payload: { access_token: plaid[p].access_token, item_id: plaid[p].item_id, user_id: plaid[p].user_id, institution: plaid[p].institution },
      })
    }
    
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_net_worth: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}