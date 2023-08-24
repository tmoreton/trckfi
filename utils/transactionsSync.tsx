// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
import plaidClient from '../utils/plaid';
import { formatAmount } from '../lib/lodash'
import { snakeCase } from "snake-case";
import { icons } from '../lib/categories'
import { DateTime } from "luxon"

const transactionsSync = async ({ access_token, next_cursor, accounts, rules, user_id }) => {
  try {
    const request = {
      access_token: access_token,
      cursor: next_cursor,
      count: 250,
      options: {
        include_personal_finance_category: true
      }
    }

    const response = await plaidClient.transactionsSync(request)
    let added = response.data.added
    let removed = response.data.removed
    let has_more = response.data.has_more
    next_cursor = response.data.next_cursor
    // Added Transactions
    while(has_more){
      for (let i in added) {
        let { id, type } = accounts.find(a => a.account_id === added[i].account_id)
        let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
        let { amount } = formatAmount(type, added[i].amount)
        let rule = rules.find(r => added[i].name.toUpperCase().includes(r.identifier.toUpperCase()))
        console.log(added[i])
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
            // @ts-ignore
            name: rule?.ruleset?.name || added[i].name,
            merchant_name: added[i].merchant_name,
            category: added[i].category,
            // @ts-ignore
            detailed_category: rule?.ruleset?.detailed_category && snakeCase(rule?.ruleset?.detailed_category).toUpperCase() || detailed_category,
            unified: icons[detailed_category],
            // @ts-ignore
            primary_category: rule?.ruleset?.primary_category && snakeCase(rule?.ruleset?.primary_category).toUpperCase() || added[i].personal_finance_category.primary,
            // @ts-ignore
            location: added[i].location,
            pending: added[i].pending,
            user_id: user_id,
            currency: added[i].iso_currency_code,
            item_id: accounts[0].item_id,
            month_year: added[i].date.substring(0,7),
            week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
            // @ts-ignore
            active: rule?.ruleset?.active && (rule?.ruleset?.active === 'true') || true,
            // @ts-ignore
            recurring: rule?.ruleset?.recurring && (rule?.ruleset?.recurring === 'true') || false,
          },
        })
      }
    }
    // Removed Transactions
    for (let r in removed) {
      await prisma.transactions.delete({
        where: {
          transaction_id: removed[r].transaction_id
        },
      })
    }

    await prisma.plaid.update({
      where: { item_id: accounts[0].item_id },
      data: { 
        cursor: next_cursor,
        error_code: null
      }
    })
  } catch (error) {
    console.error(error)
    await prisma.plaid.update({
      where: { item_id: accounts[0].item_id },
      data: { error_code: error.response?.data?.error_code }
    })
    throw new Error(error)
  }
}

export default transactionsSync