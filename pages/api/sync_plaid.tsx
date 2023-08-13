// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { formatAmount, getAmount } from '../../lib/lodash'
import { snakeCase } from "snake-case";
import { icons } from '../../lib/categories'
import { DateTime } from "luxon"

export default async (req, res) => {
  let { user, access_token } = req.body
  
  if (!user || !access_token) return res.status(500)

  const { id, linked_user_id } = user

  let linked_user = null
  if(linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
  }
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  const rules = await prisma.rules.findMany({
    where: {
      OR: query,
    }
  })

  const plaidAccount = await prisma.plaid.findUnique({
    where: {
      access_token: access_token
    },
  })

  let newAccountArray = []
  
  // @ts-ignore
  try {
    const accountResponse = await plaidClient.accountsGet({ access_token: plaidAccount.access_token })
    let plaidAccounts = accountResponse.data.accounts
    for (let i in plaidAccounts) {
      let newAccount = await prisma.accounts.upsert({
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
          item_id: plaidAccount.item_id,
          account_id: plaidAccounts[i].account_id,
          name: plaidAccounts[i].name,
          // @ts-ignore
          details: plaidAccounts[i].balances,
          official_name: plaidAccounts[i].official_name || plaidAccounts[i].name,
          // @ts-ignore
          institution:  plaidAccount.institution,
          subtype: plaidAccounts[i].subtype,
          type: plaidAccounts[i].type,
          user_id: user.id,
          amount: getAmount(plaidAccounts[i]),
        },
      })
      newAccountArray.push(newAccount)
    }

    let has_more = true
    let next_cursor = ''

    while (has_more) {
      const request = {
        access_token: plaidAccount.access_token,
        cursor: next_cursor,
        count: 250,
        options: {
          include_personal_finance_category: true
        }
      }
  
      const response = await plaidClient.transactionsSync(request)
      let added = response.data.added
      next_cursor = response.data.next_cursor
      has_more = response.data.has_more
      for (let i in added) {
        let { id, type } = newAccountArray.find(a => a.account_id === added[i].account_id)
        let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
        let { amount } = formatAmount(type, added[i].amount)
        let rule = rules.find(r => added[i].name.toUpperCase().includes(r.identifier.toUpperCase()))
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
            user_id: user.id,
            currency: added[i].iso_currency_code,
            item_id: newAccountArray[0].item_id,
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

    await prisma.plaid.update({
      where: { item_id: newAccountArray[0].item_id },
      data: { 
        cursor: next_cursor,
        error_code: null
      }
    })

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    await prisma.plaid.update({
      where: { item_id: newAccountArray[0].item_id },
      data: { error_code: error.response?.data?.error_code }
    })
  }
}