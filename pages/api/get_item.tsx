// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { account } = req.body
  try {
    const response = await plaidClient.itemGet({
      access_token: account.plaid.access_token
    })
    return res.status(200).json('ok')
  } catch (e) {
    console.error(e)
    slackMessage('Error get_item: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}
