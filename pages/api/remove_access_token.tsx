// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { account } = req.body
  try {

    if(!account?.plaid){
      await prisma.accounts.updateMany({
        where: {
          id: account.id
        },
        data: {
          active: false,
          user_id: null,
          account_id: null
        }
      })
      await prisma.transactions.updateMany({
        where: {
          id: account.id
        },
        data: {
          active: false,
          user_id: null,
          transaction_id: null
        }
      })
    } else {
      if(account?.plaid?.error_code !== 'ITEM_NOT_FOUND'){
        await plaidClient.itemRemove({
          access_token: account.plaid.access_token
        })
      }
  
      await prisma.plaid.updateMany({
        where: {
          item_id: account.item_id
        },
        data: {
          active: false,
          user_id: null
        }
      })
      await prisma.accounts.updateMany({
        where: {
          item_id: account.item_id
        },
        data: {
          active: false,
          user_id: null,
          account_id: null
        }
      })
      await prisma.transactions.updateMany({
        where: {
          item_id: account.item_id
        },
        data: {
          active: false,
          user_id: null,
          transaction_id: null
        }
      })
    }
    
    return res.status(200).json('ok')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
