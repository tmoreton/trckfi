// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import netWorthSync from '../../utils/netWorthSync'
import accountsSync from '../../utils/accountsSync'
import transactionsSync from '../../utils/transactionsSync'
import slackMessage from '../../utils/slackMessage'
import { client } from "../../trigger";

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Account Info' })
  try {

    const plaid = await prisma.plaid.findMany({
      where: {
        active: true,
        user_id: user.id
      },
    })

    for (let p in plaid) {
      await accountsSync(plaid[p].access_token, plaid[p].item_id, plaid[p].user_id, plaid[p].institution)
      // await transactionsSync(plaid[p].access_token, plaid[p].user_id)
      await client.sendEvent({
        name: "sync.plaid",
        payload: { access_token: plaid[p].access_token, item_id: plaid[p].item_id, user_id: plaid[p].user_id, institution: plaid[p].institution },
      })
    }
    await netWorthSync(user.id)
    
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_net_worth: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}