// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';
import { getAmount } from '../lib/lodash'

const accountsSync = async (access_token, item_id, user_id, institution) => {
  try {
    const accountResponse = await plaidClient.accountsGet({ access_token: access_token })
    let plaidAccounts = accountResponse.data.accounts
    console.log(plaidAccounts)
    for (let i in plaidAccounts) {
      await prisma.accounts.upsert({
        where: { 
          account_id: plaidAccounts[i].account_id
        },
        update: {
          // @ts-ignore
          details: plaidAccounts[i].balances,
          amount: getAmount(plaidAccounts[i]),
          active: true
        },
        create: {
          item_id,
          institution,
          account_id: plaidAccounts[i].account_id,
          name: plaidAccounts[i].name,
          // @ts-ignore
          details: plaidAccounts[i].balances,
          official_name: plaidAccounts[i].official_name || plaidAccounts[i].name,
          subtype: plaidAccounts[i].subtype,
          type: plaidAccounts[i].type,
          user_id: user_id,
          amount: getAmount(plaidAccounts[i]),
        },
      })
    }
  } catch (error) {
    console.error(error)
    // throw new Error(error)
  }
}

export default accountsSync