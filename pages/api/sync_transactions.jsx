// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon"

const icons = {
  "COFFEE": "2615",
  "FAST_FOOD": "1f35f",
  "FLIGHTS": "2708-fe0f",
  "GYMS_AND_FITNESS_CENTERS": "1f3cb-fe0f",
  "RENT": "1f3e1",
  "RESTAURANT": "1f37d-fe0f",
  "SPORTING_GOODS": "1f3c8",
  "TAXIS_AND_RIDE_SHARES": "1f695",
  "GAS_AND_ELECTRICITY": "1f4a1",
  "BEER_WINE_AND_LIQUOR": "1f37a",
  "ATM_FEES": "1f3e6",
  "INTEREST_EARNED": "1f4b0",
  "WAGES": "1f4b0",
  "PARKING": "1f697",
}

export default async (req, res) => {
  const { user_id, access_token } = req.body
  if (!user_id || !access_token) return res.status(500).json({ error: 'No Token or User' })

  const plaidAccount = await prisma.plaid.findUnique({
    where: {
      access_token: access_token
    },
  })

  const accounts = await prisma.accounts.findMany({
    where: { 
      user_id: user_id,
      active: true
    },
  })

  const formatAmount = (account_id, amount) => {
    let { type, official_name } = accounts.find(a => a.account_id === account_id)
    if(type === 'credit' || type === 'loan'){
      if(Number(amount) < 0){
        return { amount: Number(Math.abs(amount)).toFixed(2), account_name: official_name, type }
      }
      return { amount: Number(-Math.abs(amount)).toFixed(2), account_name: official_name, type }
    } else {
      if(Number(amount) > 0){
        return { amount: Number(-Math.abs(amount)).toFixed(2), account_name: official_name, type }
      }
      return { amount: Number(Math.abs(amount)).toFixed(2), account_name: official_name, type }
    }
  }

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

    for (let i in added) {
      let detailed_category = added[i].personal_finance_category.detailed.replace(`${added[i].personal_finance_category.primary}_`, '')
      let { amount, account_name, type } = formatAmount(added[i].account_id, added[i].amount)
      await prisma.transactions.upsert({
        where: { 
          transaction_id: added[i].transaction_id 
        },
        update: {},
        create: {
          transaction_id: added[i].transaction_id,
          account_id: added[i].account_id,
          account_name: account_name,
          type: type,
          amount: amount,
          authorized_date: new Date(added[i].date),
          date: added[i].date,
          name: added[i].name,
          merchant_name: added[i].merchant_name,
          payment_channel: added[i].payment_channel,
          category: added[i].category,
          detailed_category: detailed_category,
          unified: icons[detailed_category],
          primary_category: added[i].personal_finance_category.primary,
          pending: added[i].pending,
          location: added[i].location,
          user_id: user_id,
          item_id: plaidAccount.item_id,
          month_year: added[i].date.substring(0,7),
          week_year: `${added[i].date.substring(0,4)}-${DateTime.fromISO(added[i].date).weekNumber}`,
        },
      })
    }

    await prisma.plaid.update({
      where: { access_token: access_token },
      data: { cursor: next_cursor }
    })

    return res.status(200).json({ has_more: has_more })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}