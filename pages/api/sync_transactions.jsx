// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id, access_token } = req.body
  if (!user_id || !access_token) return res.status(500)

  const plaidAccount = await prisma.plaid.findUnique({
    where: {
      access_token: access_token
    },
  })

  const request = {
    access_token: plaidAccount.access_token,
    cursor: plaidAccount?.cursor || '',
    count: 100,
    options: {
      include_personal_finance_category: true
    }
  }

  try {
    const response = await plaidClient.transactionsSync(request)
    let added = response.data.added
    let next_cursor = response.data.next_cursor
    let has_more = response.data.has_more

    for (var i in added) {
      await prisma.transactions.upsert({
        where: { 
          transaction_id: added[i].transaction_id 
        },
        update: {},
        create: {
          transaction_id: added[i].transaction_id,
          account_id: added[i].account_id,
          amount: added[i].amount,
          authorized_date: added[i].authorized_date || added[i].date,
          date: new Date(added[i].date),
          name: added[i].name,
          merchant_name: added[i].merchant_name,
          payment_channel: added[i].payment_channel,
          category: added[i].category,
          detailed_category: added[i].personal_finance_category.detailed,
          primary_category: added[i].personal_finance_category.primary,
          pending: added[i].pending,
          location: added[i].location,
          user_id: user_id,
          item_id: plaidAccount.item_id
        },
      })
    }

    await prisma.plaid.update({
      where: { access_token: access_token },
      data: { cursor: next_cursor }
    })

    return res.status(200).json({ has_more: has_more })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}