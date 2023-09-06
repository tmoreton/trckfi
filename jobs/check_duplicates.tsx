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

    const transactions1 = await prisma.transactions.findMany({
      where: {
        active: true,
        user_id: { in: ids },
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ days: 2 }).startOf('day').toISO(),
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
    })

    const transactions2 = await prisma.transactions.findMany({
      where: {
        active: true,
        user_id: { in: ids },
        authorized_date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ days: 2 }).startOf('day').toISO(),
        },
        NOT: [
          { detailed_category: 'CREDIT_CARD_PAYMENT' },
        ],
      },
    })

    transactions1.forEach((t1) => {
      transactions2.forEach(async (t2) => {
        if(t1.transaction_id !== t2.transaction_id){
          if(Number(t1.amount) + Number(t2.amount) === 0){
            console.log('Internal Transfer amount: ', t2.amount)
            console.log(t1.name)
            console.log(t2.name)
            await prisma.transactions.updateMany({
              where: { 
                OR: [{ id: t1.id }, { id: t2.id }]
              },
              data: { 
                active: false
              }
            })
          } 
          // else if(Number(t1.amount) === Number(t2.amount) && t1.name === t2.name){
          //   console.log('duplicate')
          //   console.log(t1.name)
          //   console.log(t2.name)
          //   await prisma.transactions.update({
          //     where: { 
          //       id: t2.id
          //     },
          //     data: { 
          //       active: false
          //     }
          //   })
          // }
        }
      })
    })

  },
});