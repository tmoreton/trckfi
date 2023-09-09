import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime } from "luxon";

client.defineJob({
  id: "check-duplicates",
  name: "Check Duplicates",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 12 * * *",
  }),
  run: async (payload, io, ctx) => {
    let users = await prisma.user.findMany({
      where: {
        active: true,
      }
    })
    const ids = users.map(user => user.id)

    const transactions = await prisma.transactions.findMany({
      where: {
        user_id: { in: ids },
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ days: 3 }).startOf('day').toISO(),
        },
      },
    })

    transactions.forEach((t1) => {
      transactions.forEach(async (t2) => {
        if(t1.transaction_id !== t2.transaction_id){
          if(Number(t1.amount) + Number(t2.amount) === 0){
            await prisma.transactions.updateMany({
              where: { 
                OR: [{ id: t1.id }, { id: t2.id }]
              },
              data: { 
                active: false
              }
            })
          } 
        }
      })
    })
  },
});