import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync';
import accountsSync from '../../utils/accountsSync';

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  console.log(webhook_code, item_id)
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      let { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
      let accounts = accountsSync({ access_token, item_id, user_id })
      transactionsSync({ access_token, next_cursor: '', accounts, user_id})
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
