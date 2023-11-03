import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync'
import recurringSync from '../../utils/recurringSync'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
  try{
    switch (webhook_code) {
      case 'SYNC_UPDATES_AVAILABLE':
        await transactionsSync(access_token, user_id)
        break;
      case 'RECURRING_TRANSACTIONS_UPDATE':
        await recurringSync(access_token)
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
