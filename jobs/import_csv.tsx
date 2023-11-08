import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime } from "luxon"

client.defineJob({
  id: "import-csv",
  name: "import-csv",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "import.csv"
  }),
  run: async (payload, io, ctx) => {
    const { rows, user_id } = payload

    rows.map(async i => {      
      let category = i.primary_category?.replaceAll(' ', '_').toUpperCase()
      let dt = DateTime.fromFormat(i.date, 'D')
      let date = dt.toFormat('yyyy-MM-dd')
      let data = {
        name: i.name,
        merchant_name: i.name,
        account_name: i.account_name,
        primary_category: category,
        detailed_category: 'CSV_IMPORT',
        category: [i.primary_category],
        date,
        authorized_date: dt.toISO(),
        amount: i.type === 'credit' ? Number(-i.amount) : Number(i.amount),
        notes: i?.notes,
        tags: i?.labels ? [i.labels.split(" ")] : null,
        user_id: user_id,
        pending: false,
        active: true,
        currency: 'USD',
        year: dt.toFormat('yyyy'),
        month_year: dt.toFormat('yyyy-MM'),
        week_year: `${dt.toFormat('yyyy')}-${dt.weekNumber}`,
      }

      const transaction = await prisma.transactions.findFirst({
        where: { 
          date: date,
          amount: Number(i.amount),
          user_id: user_id
        }
      })

      if(!transaction?.id) {
        await prisma.transactions.create({ data })
      }
    })
  },
});

