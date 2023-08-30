import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync'

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  console.log(webhook_code, item_id)
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      let { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id: item_id }})
      await transactionsSync(access_token, user_id)
      break;
    case 'RECURRING_TRANSACTIONS_UPDATE':

      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
