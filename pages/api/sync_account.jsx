// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon"
import { formatAmount } from '../../lib/lodash'
import { icons } from '../../lib/categories'
import { snakeCase } from "snake-case";

export default async (req, res) => {
  let { plaid, user } = req.body

  if (!plaid) return res.status(500).json({ error: 'No plaid token' })

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
      id: plaid.id,
    },
    include: {
      accounts: true
    }
  })
  
  try {
    const request = {
      access_token: plaidAccount.access_token,
      cursor: '',
      count: 250,
      options: {
        include_personal_finance_category: true
      }
    }

    const response = await plaidClient.transactionsSync(request)
    let added = response.data.added
    let next_cursor = response.data.next_cursor
    // let has_more = response.data.has_more
    for (let i in added) {
      let { id, type } = plaidAccount.accounts.find(a => a.account_id === added[i].account_id)
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
          name: rule?.ruleset?.name || added[i].name,
          merchant_name: added[i].merchant_name,
          category: added[i].category,
          detailed_category: rule?.ruleset?.detailed_category && snakeCase(rule?.ruleset?.detailed_category).toUpperCase() || detailed_category,
          unified: icons[detailed_category],
          primary_category: rule?.ruleset?.primary_category && snakeCase(rule?.ruleset?.primary_category).toUpperCase() || added[i].personal_finance_category.primary,
          location: added[i].location,
          user_id: user.id,
          currency: added[i].iso_currency_code,
          item_id: plaidAccount.item_id,
          month_year: added[i].date.substring(0,7),
          week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
          active: rule?.ruleset?.active && (rule?.ruleset?.active === 'true') || true,
          recurring: rule?.ruleset?.recurring && (rule?.ruleset?.recurring === 'true') || false,
        },
      })
    }
    await prisma.plaid.update({
      where: { id: plaidAccount.id },
      data: { 
        cursor: next_cursor,
        error_code: null
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {    
    console.error(error)
    await prisma.plaid.update({
      where: { id: plaidAccount.id },
      data: { error_code: error.response?.data?.error_code }
    })
    throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}