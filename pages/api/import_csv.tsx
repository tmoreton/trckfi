// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'
import { DateTime } from "luxon"

export default async (req, res) => {
  const { rows, user } = req.body
  if (!rows || !user) return res.status(500)

  try {
    rows.map(async i => {
      let date = i.date.replaceAll('/', '-')
      let category = i.primary_category.replaceAll(' ', '_').toUpperCase()
      let data = {
        name: i.name,
        custom_name: i.name,
        primary_category: category,
        detailed_category: category,
        category: [i.primary_category],
        date,
        authorized_date: DateTime.fromFormat(i.date, 'D').toISO(),
        amount: Number(i.amount),
        notes: i.notes,
        tags: i.labels && [i.labels.split(" ")],
        user_id: user.id,
        pending: false,
        active: true,
        currency: 'USD'
      }

      const transaction = await prisma.transactions.findFirst({
        where: { 
          date: date,
          amount: Number(i.amount),
          user_id: user.id
        }
      })

      if(!transaction?.id) {
        await prisma.transactions.create({ data })
      }
    })

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error import_csv: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}