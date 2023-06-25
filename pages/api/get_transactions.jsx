// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id } = req.body
  if (!user_id) return res.status(500)

  const plaidAccount = await prisma.plaid.findMany({
    where: { user_id: user_id },
  })

  const request = {
    access_token: plaidAccount[0].access_token,
    start_date: DateTime.now().minus({ year: 1 }).toFormat('yyyy-MM-dd'),
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
      let transaction = {
        transaction_id: transactions[i].transaction_id,
        account_id: transactions[i].account_id,
        amount: transactions[i].amount.toString(),
        authorized_date: transactions[i].authorized_date,
        date: transactions[i].date,
        name: transactions[i].name,
        merchant_name: transactions[i].merchant_name,
        payment_channel: transactions[i].payment_channel,
        detailed_category: transactions[i].personal_finance_category.detailed,
        primary_category: transactions[i].personal_finance_category.primary,
        pending: false,
        location: transactions[i].location,
        transaction_type: transactions[i].transaction_type,
        user_id: user_id
      }

      await prisma.transactions.upsert({
        where: { 
          transaction_id: transactions[i].transaction_id 
        },
        update: {},
        create: transaction,
      })
    }
    
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}