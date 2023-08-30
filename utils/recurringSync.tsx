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
    let inflowStreams = response.data.inflow_streams
    let outflowStreams = response.data.outflow_streams
    // @ts-ignore
    for (let i in inflowStreams) {
      // @ts-ignore
      await prisma.recurring.upsert({
        where: { 
          stream_id: inflowStreams[i].stream_id 
        },
        update: {},
        create: {
          stream_id: inflowStreams[i].stream_id,
          average_amount: inflowStreams[i].average_amount.amount,
          last_amount: inflowStreams[i].last_amount.amount,
          account_id: inflowStreams[i].account_id,
          description: inflowStreams[i].description,
          merchant_name: inflowStreams[i].merchant_name,
          primary_category: inflowStreams[i].personal_finance_category.primary,
          detailed_category: inflowStreams[i].personal_finance_category.detailed,
          first_date: inflowStreams[i].first_date,
          last_date: inflowStreams[i].last_date,
          frequency: inflowStreams[i].frequency,
          transaction_ids: inflowStreams[i].transaction_ids,
          is_active: inflowStreams[i].is_active,
          status: inflowStreams[i].status,
          type: 'inflow'
        },
      })
    }
    // @ts-ignore
    for (let i in outflowStreams) {
      // @ts-ignore
      await prisma.recurring.upsert({
        where: { 
          stream_id: outflowStreams[i].stream_id 
        },
        update: {},
        create: {
          stream_id: outflowStreams[i].stream_id,
          average_amount: outflowStreams[i].average_amount.amount,
          last_amount: outflowStreams[i].last_amount.amount,
          account_id: outflowStreams[i].account_id,
          description: outflowStreams[i].description,
          merchant_name: outflowStreams[i].merchant_name,
          primary_category: outflowStreams[i].personal_finance_category.primary,
          detailed_category: outflowStreams[i].personal_finance_category.detailed,
          first_date: outflowStreams[i].first_date,
          last_date: outflowStreams[i].last_date,
          frequency: outflowStreams[i].frequency,
          transaction_ids: outflowStreams[i].transaction_ids,
          is_active: outflowStreams[i].is_active,
          status: outflowStreams[i].status,
          type: 'outflow'
        },
      })
    }
    

  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export default recurringSync