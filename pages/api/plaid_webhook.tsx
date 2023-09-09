import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  console.log(webhook_code, item_id)
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
      console.log(access_token, user_id)
      transactionsSync(access_token, user_id)
      break;
    case 'RECURRING_TRANSACTIONS_UPDATE':
      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
