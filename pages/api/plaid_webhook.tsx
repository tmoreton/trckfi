import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  try{
    switch (webhook_code) {
      case 'SYNC_UPDATES_AVAILABLE':
        // const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
        // transactionsSync(access_token, user_id)
        break;
      case 'RECURRING_TRANSACTIONS_UPDATE':
        break;
      default:
        break;
    }
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
