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
    start_date: DateTime.now().minus({ month: 1 }).startOf('month').toFormat('yyyy-MM-dd'),
    end_date: DateTime.now().toFormat('yyyy-MM-dd'),
    options: {
      include_personal_finance_category: true
    }
  }

  try {
    const response = await plaidClient.transactionsGet(request)
    let transactions = response.data.transactions
    let accounts = response.data.accounts

    for (var i in accounts) {
      await prisma.accounts.upsert({
        where: { 
          account_id: accounts[i].account_id
        },
        update: {
          balances: accounts[i].balances,
        },
        create: {
          access_token: plaidAccount.access_token,
          item_id: plaidAccount.item_id,
          account_id: accounts[i].account_id,
          name: accounts[i].name,
          balances: accounts[i].balances,
          official_name: accounts[i].official_name,
          subtype: accounts[i].subtype,
          type: accounts[i].type,
          user_id: user_id
        },
      })
    }

    for (var i in transactions) {
      await prisma.transactions.upsert({
        where: { 
          transaction_id: transactions[i].transaction_id 
        },
        update: {},
        create: {
          transaction_id: transactions[i].transaction_id,
          account_id: transactions[i].account_id,
          amount: transactions[i].amount,
          authorized_date: transactions[i].authorized_date || transactions[i].date,
          date: new Date(transactions[i].date),
          name: transactions[i].name,
          merchant_name: transactions[i].merchant_name,
          payment_channel: transactions[i].payment_channel,
          detailed_category: transactions[i].personal_finance_category.detailed,
          primary_category: transactions[i].personal_finance_category.primary,
          pending: transactions[i].pending,
          location: transactions[i].location,
          user_id: user_id,
          item_id: plaidAccount.item_id
        },
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}