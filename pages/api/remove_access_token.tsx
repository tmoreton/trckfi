// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import prisma from '../../lib/prisma';
import netWorthSync from '../../utils/netWorthSync'

export default async (req, res) => {
  const { account } = req.body
  try {
    if(!account?.plaid){
      await prisma.accounts.deleteMany({
        where: {
          id: account.id
        }
      })
    } else {
      if(account?.plaid?.error_code !== 'ITEM_NOT_FOUND'){
        await plaidClient.itemRemove({
          access_token: account.plaid.access_token
        })
      }
      await prisma.plaid.deleteMany({
        where: {
          item_id: account.item_id
        }
      })
    }
    netWorthSync(account.user_id)
    return res.status(200).json('ok')
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
