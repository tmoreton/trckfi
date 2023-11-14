// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { transaction } = req.body
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { id, name, unified, primary_category, detailed_category, amount, notes, date, alert_date, account_id, custom_name, tags } = transaction

  try {
    await prisma.transactions.update({
      where: { id },
      data: { 
        amount: Number(amount).toFixed(2),
        primary_category: snakeCase(primary_category).toUpperCase(),
        detailed_category: snakeCase(detailed_category).toUpperCase(),
        // @ts-ignore
        custom_name,
        name,
        unified,
        account_id,
        notes,
        date,
        alert_date,
        tags,
        authorized_date: new Date(date),
        month_year: date.substring(0,7),
        year: date.substring(0,4),
        week_year: `${date.substring(0,4)}-${DateTime.fromISO(date).weekNumber}`
      }
    })
    let transaction = await prisma.transactions.findUnique({
      where: { id },
      include: {
        account: true,
        user: true
      },
    })
    return res.status(200).json({ status: 'OK', updated_transaction: transaction })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}