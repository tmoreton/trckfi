// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { getAmount } from '../../lib/lodash'

export default async (req, res) => {
  let { user_id, access_token } = req.body
  
  if (!user_id || !access_token) return res.status(500)

  const plaidAccount = await prisma.plaid.findUnique({
    where: {
      access_token: access_token
    },
  })
  
  // @ts-ignore
  try {
    const response = await plaidClient.accountsGet({ access_token: plaidAccount.access_token })
    let accounts = response.data.accounts
    for (var i in accounts) {
      console.log(accounts[i])
      await prisma.accounts.upsert({
        where: { 
          account_id: accounts[i].account_id
        },
        update: {
          // @ts-ignore
          details: accounts[i].balances,
          amount: getAmount(accounts[i]),
          active: true
        },
        create: {
          item_id: plaidAccount.item_id,
          account_id: accounts[i].account_id,
          name: accounts[i].name,
          // @ts-ignore
          details: accounts[i].balances,
          official_name: accounts[i].official_name || accounts[i].name,
          // @ts-ignore
          institution:  plaidAccount.institution,
          subtype: accounts[i].subtype,
          type: accounts[i].type,
          user_id: user_id,
          amount: getAmount(accounts[i]),
        },
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}