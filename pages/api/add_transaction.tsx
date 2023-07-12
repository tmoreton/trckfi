// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import { DateTime } from "luxon";

export default async (req, res) => {
  const { transaction, user } = JSON.parse(req.body)
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { name, unified, primary_category, detailed_category, amount, notes, date } = transaction
  try {
    let data = { 
      payment_channel: 'trckfi',
      amount: Number(amount).toFixed(2),
      primary_category: snakeCase(primary_category).toUpperCase(),
      detailed_category: snakeCase(detailed_category).toUpperCase(),
      month_year: date.substring(0,7),
      week_year: `${date.substring(0,4)}-${DateTime.fromISO(date).weekNumber}`,
      authorized_date: new Date(date),
      date,
      name,
      unified,
      notes,
      user_id: user.id,
    }
    await prisma.transactions.create({ data })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}