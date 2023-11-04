// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid'
import { DateTime } from "luxon"
import slackMessage from '../utils/slackMessage'
import { icons } from '../lib/categories'

const recurringSync = async (access_token) => {
  try {
    const { accounts, user_id } = await prisma.plaid.findUnique({
      where: {
        access_token,
      },
      include: {
        accounts: true
      }
    })
    const accountIds = accounts.map(a => a.account_id && a.account_id)

    const rules = await prisma.rules.findMany({
      where: {
        user_id,
      }
    })

    if(accountIds.length > 0){
      const request = {
        access_token: access_token,
        account_ids : accountIds,
        options: { 
          include_personal_finance_category: true
        }
      }
      const response = await plaidClient.transactionsRecurringGet(request)
      let inflow = response.data.inflow_streams
      let outflows = response.data.outflow_streams

      const upcoming = (item) => {
        if(item){
          switch (item.frequency) {
            case 'ANNUALLY':
              return DateTime.fromISO(item.last_date).plus({ years: 1 }).toFormat('yyyy-MM-dd')
            case 'MONTHLY':
              return DateTime.fromISO(item.last_date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
            case 'SEMI_MONTHLY':
              return DateTime.fromISO(item.last_date).plus({ months: 2 }).toFormat('yyyy-MM-dd')
            case 'BIWEEKLY':
              return DateTime.fromISO(item.last_date).plus({ weeks: 2 }).toFormat('yyyy-MM-dd')
            case 'WEEKLY':
              return DateTime.fromISO(item.last_date).plus({ weeks: 1 }).toFormat('yyyy-MM-dd')
            default:
              break;
          }  
        }
      }

      // const checkBool = (rule) => {
      //   if(rule?.ruleset?.active !== null){
      //     return rule?.ruleset?.active === 'true'
      //   } 
      //   return true
      // }
      
      const add_transaction = async (item, type) => {
        let transaction_name = item.merchant_name || item.description
        let detailed_category = item.personal_finance_category.detailed.replace(`${item.personal_finance_category.primary}_`, '')
        let rule = rules.find(r => transaction_name.toUpperCase().includes(r.identifier.toUpperCase()))
        // @ts-ignore
        let custom_detailed_category = rule?.ruleset?.detailed_category || detailed_category

        await prisma.recurring.upsert({
          where: { 
            stream_id: item.stream_id 
          },
          update: {
            average_amount: -(item.average_amount.amount),
            last_amount: -(item.last_amount.amount),
            last_date: item.last_date,
            frequency: item.frequency,
            status: item.status,
            upcoming_date: upcoming(item)
          },
          create: {
            stream_id: item.stream_id,
            average_amount: -(item.average_amount.amount),
            last_amount: -(item.last_amount.amount),
            account_id: item.account_id,
            // @ts-ignore
            custom_name: rule?.ruleset?.custom_name || item.merchant_name,
            // @ts-ignore
            name: item.description,
            merchant_name: item.merchant_name,
            // @ts-ignore
            primary_category: rule?.ruleset?.primary_category || item.personal_finance_category.primary,
            detailed_category: custom_detailed_category,
            first_date: item.first_date,
            last_date: item.last_date,
            frequency: item.frequency,
            transaction_ids: item.transaction_ids,
            is_active: item.is_active,
            active: true,
            status: item.status,
            type,
            user_id,
            upcoming_date: upcoming(item),
            // @ts-ignore
            unified: rule?.ruleset?.unified || icons[custom_detailed_category]
          },
        })
      }
      
      for (let i in inflow) {
        add_transaction(inflow[i], 'inflow')
      }
      // @ts-ignore
      for (let o in outflows) {
        add_transaction(outflows[o], 'outflow')
      }
    }
  } catch (e) {
    console.error(e)
    slackMessage('Error recurring_sync: ' + e.message || e.toString())
  }
}

export default recurringSync
