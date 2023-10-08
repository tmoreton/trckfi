// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';
import { formatAmount } from '../lib/lodash'
import { icons } from '../lib/categories'
import { DateTime } from "luxon"
import slackMessage from '../utils/slackMessage'

const transactionsSync = async (access_token, user_id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    })

    const query = user.linked_user_id ? [{ user_id: user.id }, { user_id: user.linked_user_id }] : [{ user_id: user.id }]

    const rules = await prisma.rules.findMany({
      where: {
        OR: query,
      }
    })

    const plaid = await prisma.plaid.findUnique({
      where: { 
        access_token: access_token,
        active: true
      },
      include: {
        accounts: true
      }
    })

    let next_cursor = !plaid.error_code && plaid.cursor ? plaid.cursor : ''

    const request = {
      access_token: access_token,
      cursor: next_cursor,
      count: 250,
      options: {
        include_personal_finance_category: true
      }
    }

    const checkBool = (rule) => {
      if(rule?.ruleset?.active !== null){
        return rule?.ruleset?.active === 'true'
      } 
      return true
    }

    const response = await plaidClient.transactionsSync(request)
    let added = response.data.added
    let removed = response.data.removed
    let has_more = response.data.has_more
    next_cursor = response.data.next_cursor
    
    while(has_more){
      for (let i in added) {
        let { id, type, name } = plaid.accounts.find(a => a.account_id === added[i].account_id)
        let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
        let { amount } = formatAmount(type, added[i].amount)
        let transaction_name = added[i].merchant_name || added[i].name
        let rule = rules.find(r => transaction_name.toUpperCase().includes(r.identifier.toUpperCase()))
        // @ts-ignore
        // slackMessage(`${added[i].date} ${name} New Transaction: ${rule?.ruleset?.name || added[i].merchant_name || added[i].name} for $${amount}`)

        await prisma.transactions.upsert({
          where: { 
            transaction_id: added[i].transaction_id 
          },
          update: {},
          create: {
            amount,
            account_id: id,
            transaction_id: added[i].transaction_id,
            authorized_date: new Date(added[i].date),
            date: added[i].date,
            name: added[i].name,
            // @ts-ignore
            custom_name: rule?.ruleset?.name || added[i].merchant_name,
            merchant_name: added[i].merchant_name,
            category: added[i].category,
            // @ts-ignore
            detailed_category: rule?.ruleset?.detailed_category || detailed_category,
            // @ts-ignore
            unified: rule?.ruleset?.unified || icons[detailed_category],
            // @ts-ignore
            primary_category: rule?.ruleset?.primary_category || added[i].personal_finance_category.primary,
            // @ts-ignore
            location: added[i].location,
            pending: added[i].pending,
            user_id: user.id,
            currency: added[i].iso_currency_code,
            item_id: plaid.item_id,
            month_year: added[i].date.substring(0,7),
            week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
            active: true,
            // @ts-ignore
            recurring: false,
          },
        })
      }
      await prisma.plaid.update({
        where: { item_id: plaid.item_id },
        data: { 
          cursor: next_cursor,
          error_code: null
        }
      })
    }

    // Removed Transactions
    // for (let r in removed) {
    //   await prisma.transactions.delete({
    //     where: {
    //       transaction_id: removed[r].transaction_id
    //     },
    //   })
    // }

  } catch (e) {
    console.error(e)
    slackMessage('Error transactions_sync: ' + e.message || e.toString())
    const plaid = await prisma.plaid.findUnique({
      where: { 
        access_token: access_token 
      }
    })
    await prisma.plaid.update({
      where: { item_id: plaid.item_id },
      data: { error_code: e.response?.data?.error_code }
    })
  }
}

export default transactionsSync
