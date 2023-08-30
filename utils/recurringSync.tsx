// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';

const recurringSync = async (access_token) => {
  try {
   
    const { accounts } = await prisma.plaid.findUnique({
      where: {
        access_token,
      },
      include: {
        accounts: true
      }
    })
    const accountIds = accounts.map(a => a.account_id)
    const request = {
      access_token: access_token,
      account_ids : accountIds,
      options: { 
        include_personal_finance_category: true
      }
    }
    const response = await plaidClient.transactionsRecurringGet(request)
    let inflowStreams = response.data.inflowStreams
    let outflowStreams = response.data.outflowStreams
    console.log(response.data)

  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export default recurringSync