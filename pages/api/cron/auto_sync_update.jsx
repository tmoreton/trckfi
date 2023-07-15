// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../../lib/prisma';
import plaidClient from '../../../utils/plaid';
import { DateTime } from "luxon"

export default async (req, res) => {
  try {
    const activeUsers = await prisma.user.findMany({
      where: { 
        active: true,
        subscription_id: {
          not: null
        }
      }
    })

    for (var a in activeUsers) {
      const user_id = activeUsers[a].id
      const plaidAccounts = await prisma.plaid.findMany({
        where: {
          user_id: user_id,
          active: true,
        }
      })

      for (let p in plaidAccounts) {
        const request = {
          access_token: plaidAccounts[p].access_token,
          cursor: plaidAccounts[p].cursor || '',
          count: 200,
          options: {
            include_personal_finance_category: true
          }
        }
      
        const response = await plaidClient.transactionsSync(request)
        let added = response.data.added
        // let next_cursor = response.data.next_cursor
        // let has_more = response.data.has_more
        
        for (let i in added) {
          await prisma.transactions.upsert({
            where: { 
              transaction_id: added[i].transaction_id 
            },
            update: {},
            create: {
              transaction_id: added[i].transaction_id,
              account_id: added[i].account_id,
              amount: Number(added[i].amount).toFixed(2),
              authorized_date: new Date(added[i].date),
              date: added[i].date,
              name: added[i].name,
              merchant_name: added[i].merchant_name,
              payment_channel: added[i].payment_channel,
              category: added[i].category,
              detailed_category: added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, ''),
              primary_category: added[i].personal_finance_category.primary,
              location: added[i].location,
              user_id: user_id,
              item_id: plaidAccounts[p].item_id,
              month_year: added[i].date.substring(0,7),
              week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`
            },
          })
        }
      }
    }
    
    return res.status(200).json({ status: "Ok" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}