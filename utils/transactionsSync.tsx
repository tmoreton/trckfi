// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';
import { formatAmount } from '../lib/lodash'
import { icons } from '../lib/categories'
import { DateTime } from "luxon"
import slackMessage from '../utils/slackMessage'

const transactionsSync = async (access_token, user_id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: user_id }})
    const query = user.linked_user_id ? [{ user_id: user.id }, { user_id: user.linked_user_id }] : [{ user_id: user.id }]
    const rules = await prisma.rules.findMany({ where: { OR: query }})

    const transactions = await prisma.transactions.findMany({
      where: {
        user_id,
        date: {
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          lte: DateTime.now().minus({ months: 1 }).endOf('month').toISO()
        },
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

    let next_cursor = ''
    if(!plaid.error_code && plaid.cursor){
      next_cursor = plaid.cursor
    } else if(plaid.error_code === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION'){
      next_cursor = ''
    }

    const request = {
      access_token: access_token,
      cursor: next_cursor,
      count: 100,
      options: {
        include_personal_finance_category: true
      }
    }

    // const checkBool = (rule) => {
    //   if(rule?.ruleset?.active !== null){
    //     return rule?.ruleset?.active === 'true'
    //   } 
    //   return true
    // }

    const response = await plaidClient.transactionsSync(request)
    let added = response.data.added
    let removed = response.data.removed
    let has_more = response.data.has_more
    next_cursor = response.data.next_cursor
    
    for (let i in added) {
      let { id, type, name } = plaid.accounts.find(a => a.account_id === added[i].account_id)
      let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
      let { amount } = formatAmount(type, added[i].amount)
      let transaction_name = added[i].merchant_name || added[i].name
      let rule = rules.find(r => transaction_name.toUpperCase().includes(r.identifier.toUpperCase()))
      // @ts-ignore
      let custom_detailed_category = rule?.ruleset?.detailed_category || detailed_category
      const found = transactions.find((e) => e.name === transaction_name && Number(e.amount) === Number(amount))
      const duplicate = added.find((d) => d.date === added[i].date && Number(d.amount) + Number(amount) === 0 && d.transaction_id !== added[i].transaction_id )
      if(duplicate){
        slackMessage(`Duplicates found: ${duplicate.name} ${duplicate.amount} and ${transaction_name} ${amount}`)
      }
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
          account_name: name,
          date: added[i].date,
          name: added[i].name,
          // @ts-ignore
          custom_name: rule?.ruleset?.custom_name || rule?.ruleset?.name || added[i].merchant_name,
          merchant_name: added[i].merchant_name,
          category: added[i].category,
          // @ts-ignore
          detailed_category: custom_detailed_category,
          // @ts-ignore
          unified: rule?.ruleset?.unified || icons[custom_detailed_category],
          // @ts-ignore
          primary_category: rule?.ruleset?.primary_category || added[i].personal_finance_category.primary,
          // @ts-ignore
          counterparties: added[i]?.counterparties[0],
          pending: added[i].pending,
          user_id: user.id,
          currency: added[i].iso_currency_code,
          item_id: plaid.item_id,
          month_year: added[i].date.substring(0,7),
          week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
          year: added[i].date.substring(0,4),
          active: true,
          // @ts-ignore
          recurring: found && true,
          upcoming_date: found && DateTime.fromISO(added[i].date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
        },
      })
    }

    if(has_more){
      const data = { webhook_code: 'SYNC_UPDATES_AVAILABLE', item_id: plaid.item_id }
      await prisma.webhooks.create({ data })
    }
    
    await prisma.plaid.update({
      where: { item_id: plaid.item_id },
      data: { 
        cursor: next_cursor,
        error_code: null
      }
    })

    // Removed Transactions
    for (let r in removed) {
      await prisma.transactions.upsert({
        where: { 
          transaction_id: removed[r].transaction_id 
        },
        update: {
          active: false
        },
        create: {}
      })
    }

  } catch (e) {
    console.error(e)
    slackMessage('Error transactions_sync: ' + e.response?.data?.error_code)
    const plaid = await prisma.plaid.findUnique({
      where: { 
        access_token: access_token 
      }
    })
    if(e.response?.data?.error_code === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION'){
      const data = { webhook_code: 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION', item_id: plaid.item_id }
      await prisma.webhooks.create({ data })
      await prisma.plaid.update({
        where: { item_id: plaid.item_id },
        data: { 
          error_code: null,
          cursor: ''
        }
      })
    } else {
      await prisma.plaid.update({
        where: { item_id: plaid.item_id },
        data: { error_code: e.response?.data?.error_code }
      })
    }
  }
}

export default transactionsSync
