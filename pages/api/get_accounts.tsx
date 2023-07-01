// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const { user_id, access_token } = req.body
  if (!user_id || !access_token) return res.status(500)

  const plaidAccount = await prisma.plaid.findUnique({
    where: {
      access_token: access_token
    },
  })

  try {
    const response = await plaidClient.accountsGet({ access_token: plaidAccount.access_token })
    let accounts = response.data.accounts

    for (var i in accounts) {
      await prisma.accounts.upsert({
        where: { 
          account_id: accounts[i].account_id
        },
        update: {
          balances: accounts[i].balances,
        },
        create: {
          access_token: plaidAccount.access_token,
          item_id: plaidAccount.item_id,
          account_id: accounts[i].account_id,
          name: accounts[i].name,
          balances: accounts[i].balances,
          official_name: accounts[i].official_name,
          subtype: accounts[i].subtype,
          type: accounts[i].type,
          user_id: user_id
        },
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}