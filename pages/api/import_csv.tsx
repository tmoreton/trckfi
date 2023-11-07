// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'
import { DateTime } from "luxon"
import { client } from "../../trigger";

export default async (req, res) => {
  const { rows, user } = req.body
  if (!rows || !user) return res.status(500)

  try {

    await client.sendEvent({
      name: "import.csv",
      payload: { rows, user_id: user.id },
    });
    // rows.map(async i => {
    //   let date = i.date.replaceAll('/', '-')
    //   let date_array = i.date.split('/')
    //   let category = i.primary_category.replaceAll(' ', '_').toUpperCase()
    //   let data = {
    //     name: i.name,
    //     merchant_name: i.name,
    //     account_name: i.account_name,
    //     primary_category: category,
    //     detailed_category: category,
    //     category: [i.primary_category],
    //     date,
    //     authorized_date: DateTime.fromFormat(i.date, 'D').toISO(),
    //     amount: i.type === 'credit' ? Number(-i.amount) : Number(i.amount),
    //     notes: i?.notes,
    //     tags: i?.labels ? [i.labels.split(" ")] : null,
    //     user_id: user.id,
    //     pending: false,
    //     active: true,
    //     currency: 'USD',
    //     year: date_array[2],
    //     month_year: `${date_array[0]}-${date_array[2]}`
    //   }

    //   const transaction = await prisma.transactions.findFirst({
    //     where: { 
    //       date: date,
    //       amount: Number(i.amount),
    //       user_id: user.id
    //     }
    //   })

    //   if(!transaction?.id) {
    //     await prisma.transactions.create({ data })
    //   }
    // })

    return res.status(200).json({ status: 'OK', complete: true })
  } catch (e) {
    console.error(e)
    slackMessage('Error import_csv: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}