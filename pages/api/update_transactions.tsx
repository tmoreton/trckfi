// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { transaction, ids } = req.body
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { id, name, unified, primary_category, detailed_category, amount, notes, date, alert_date, account_id, custom_name, tags } = transaction
  // let new_tags = tags && tags?.map(tag => tag.value.toUpperCase())
  try {
    let data = {}
    if (name) data['name'] = name
    if (custom_name) data['custom_name'] = custom_name
    if (notes) data['notes'] = notes
    if (amount) data['amount'] = Number(amount).toFixed(2)
    if (unified && unified !== '1f50d') data['unified'] = unified
    if (primary_category) data['primary_category'] = snakeCase(primary_category).toUpperCase()
    if (detailed_category) data['detailed_category'] = snakeCase(detailed_category).toUpperCase()
    if (alert_date) data['alert_date'] = alert_date
    if (account_id) data['account_id'] = account_id
    if (tags) data['tags'] = tags
    if (date) {
      data['date'] = date
      data['authorized_date'] = new Date(date.replace(/-/g, '\/'))
      data['month_year'] = date.substring(0,7)
      data['year'] = date.substring(0,4)
      data['week_year'] = `${date.substring(0,4)}-${DateTime.fromISO(date).weekNumber}`
    }
    
    await prisma.transactions.updateMany({
      where: {
        id: { in: ids }
      },
      data
    })
      
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}