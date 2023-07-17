// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  // let body;
  // if(typeof req.body === 'object'){
  //   body = req.body
  // } else {
  //   body = JSON.parse(req.body)
  // }  
  // let { user_id, access_token } = body
  let { user_id, access_token } = req.body

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
          // @ts-ignore
          balances: accounts[i].balances,
          active: true
        },
        create: {
          access_token: plaidAccount.access_token,
          item_id: plaidAccount.item_id,
          bank_name: plaidAccount.bank_name,
          account_id: accounts[i].account_id,
          name: accounts[i].name,
          // @ts-ignore
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
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}