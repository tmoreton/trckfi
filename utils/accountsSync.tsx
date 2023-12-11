// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';
import { getAmount } from '../lib/lodash'
import slackMessage from '../utils/slackMessage'

const accountsSync = async (access_token, item_id, user_id, institution) => {
  try {
    const accountResponse = await plaidClient.accountsGet({ access_token: access_token })
    const accountsBalance = await plaidClient.accountsBalanceGet({ access_token: access_token })
    console.log(accountsBalance.data)
    let plaidAccounts = accountResponse.data.accounts

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
    await prisma.plaid.update({
      where: { item_id },
      data: { 
        error_code: null
      }
    })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
    await prisma.plaid.update({
      where: { item_id },
      data: { error_code: error.response?.data?.error_code }
    })
  }
}

export default accountsSync