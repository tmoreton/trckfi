// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import { DateTime } from "luxon";
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { transaction, user } = req.body
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { name, unified, primary_category, detailed_category, amount, notes, date, account_id, custom_name, tags } = transaction
  try {
    let new_tags = tags && tags?.map(tag => tag.value.toUpperCase())
    let data = { 
      amount: Number(amount).toFixed(2),
      primary_category: snakeCase(primary_category).toUpperCase(),
      detailed_category: snakeCase(detailed_category).toUpperCase(),
      month_year: date.substring(0,7),
      year: date.substring(0,4),
      week_year: `${date.substring(0,4)}-${DateTime.fromISO(date).weekNumber}`,
      authorized_date: new Date(date),
      merchant_name: 'Trckfi',
      date,
      custom_name,
      name,
      unified,
      notes,
      account_id,
      tags: new_tags,
      user_id: user.id,
    }
    const new_transaction = await prisma.transactions.create({ data })
    return res.status(200).json({ status: 'OK', new_transaction })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}