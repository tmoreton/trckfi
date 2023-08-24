import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync';

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
      const accounts = await prisma.accounts.findMany({ where: { item_id }})
      const rules = await prisma.rules.findMany({ where: { user_id }})
      transactionsSync({ access_token, next_cursor: '', accounts, rules, user_id})
      break;
    case 'DEFAULT_UPDATE':
      break;
    case 'INITIAL_UPDATE':
      break;
    case 'HISTORICAL_UPDATE':
      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
