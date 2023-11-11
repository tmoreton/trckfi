// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { transaction, ids } = req.body
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { id, name, unified, primary_category, detailed_category, amount, notes, date, alert_date, account_id, custom_name, tags } = transaction

  try {
    if(ids.length > 0){
      ids.forEach( async (i) => {
        const item = await prisma.transactions.findUnique({
          where: { id: i }
        })
        
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
        if (date) {
          data['date'] = date
          data['authorized_date'] = new Date(date.replace(/-/g, '\/'))
          data['month_year'] = date.substring(0,7)
          data['week_year'] = `${date.substring(0,4)}-${DateTime.fromISO(date).weekNumber}`
        }
        
        await prisma.transactions.updateMany({
          where: { name: item.name },
          data
        })
      })
    } else {
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
    }
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}