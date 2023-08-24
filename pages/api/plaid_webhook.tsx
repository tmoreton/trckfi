import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync';
import accountsSync from '../../utils/accountsSync';

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  console.log(webhook_code, item_id)
  const sync = async (item_id) => {
    let { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
    let accounts = accountsSync({ access_token, item_id, user_id })
    transactionsSync({ access_token, next_cursor: '', accounts, user_id})
  }
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      sync(item_id)
      break;
    case 'DEFAULT_UPDATE':
      sync(item_id)
      break;
    case 'INITIAL_UPDATE': 
      sync(item_id)
      break;
    case 'HISTORICAL_UPDATE': 
    sync(item_id)
      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
