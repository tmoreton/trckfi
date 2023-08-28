import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync';
import accountsSync from '../../utils/accountsSync';

const sync = async (item_id) => {
  let { access_token, user_id, institution } = await prisma.plaid.findUnique({ where: { item_id: item_id }})
  let accounts = await accountsSync(access_token, item_id, user_id, institution)
  transactionsSync(access_token, '', accounts, user_id)
}

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  console.log(webhook_code, item_id)
  switch (webhook_code) {
    case 'SYNC_UPDATES_AVAILABLE':
      sync(item_id)
      break;
    default:
      break;
  }
  return res.status(200).json({ status: 'OK' })
}
