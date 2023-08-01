// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon"
import { formatAmount } from '../../lib/formatNumber'
import { icons } from '../../lib/categories'
import { snakeCase } from "snake-case";

export default async (req, res) => {
  let { user } = req.body

  if (!user) return res.status(500).json({ error: 'No Token or User' })

  const { id, linked_user_id } = user

  let linked_user = null
  if(linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
  }
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  const plaid = await prisma.plaid.findMany({
    where: {
      OR: query,
      active: true
    },
    include: {
      accounts: true
    }
  })

  // @ts-ignore
  const rules = await prisma.rules.findMany({
    where: {
      OR: query,
    }
  })
  
  for (let p in plaid) {
    const request = {
      access_token: plaid[p].access_token,
      cursor: plaid[p].cursor || '',
      count: 200,
      options: {
        include_personal_finance_category: true
      }
    }
    try {
      const response = await plaidClient.transactionsSync(request)
      let added = response.data.added
      let next_cursor = response.data.next_cursor
      // let has_more = response.data.has_more
      for (let i in added) {
        let { id, type } = plaid[p]?.accounts.find(a => a.account_id === added[i].account_id)
        let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
        let { amount } = formatAmount(type, added[i].amount)
        let { ruleset } = rules.find(r => r.identifier.toUpperCase() === added[i].name.toUpperCase())

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
            name: ruleset?.name || added[i].merchant_name || added[i].name,
            merchant_name: added[i].merchant_name,
            category: added[i].category,
            detailed_category: snakeCase(ruleset?.detailed_category).toUpperCase() || detailed_category,
            unified: icons[detailed_category],
            primary_category: snakeCase(ruleset?.primary_category).toUpperCase() || added[i].personal_finance_category.primary,
            // @ts-ignore
            location: added[i].location,
            user_id: user.id,
            currency: added[i].iso_currency_code,
            item_id: plaid[p].item_id,
            month_year: added[i].date.substring(0,7),
            week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
          },
        })
      }

      await prisma.plaid.update({
        where: { item_id: plaid[p].item_id },
        data: { 
          cursor: next_cursor,
          error_code: null
        }
      })
      
    } catch (error) {
      console.error(error)
      await prisma.plaid.update({
        where: { item_id: plaid[p].item_id },
        // @ts-ignore
        data: { error_code: error.response?.data?.error_code }
      })
    }
  }
  return res.status(200).json({ status: "Ok" })
}