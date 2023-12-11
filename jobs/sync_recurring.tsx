import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime, Interval } from "luxon"

client.defineJob({
  id: "sync-recurring",
  name: "sync-recurring",
  version: "0.0.1",
  enabled: true,
  trigger: eventTrigger({
    name: "sync.recurring"
  }),
  run: async (payload, io, ctx) => {
    const startDate = DateTime.now().minus({ months: 2 }).startOf('month').toISO()

    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte:  startDate
        },
      }
    })

    const updateItems = async (a, b) => {
      await prisma.transactions.update({
        where: { id: a.id },
        data: {
          recurring: true,
          upcoming_date: DateTime.fromISO(a.date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
        },
      })
      await prisma.transactions.update({
        where: { id: b.id },
        data: {
          recurring: true,
          upcoming_date: DateTime.fromISO(b.date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
        },
      })
    }

    transactions.forEach((t1) => {
      transactions.forEach(async (t2) => {
        if(t1.user_id === t2.user_id){
          if(t1.transaction_id !== t2.transaction_id && Math.abs(Number(t1.amount)) === Math.abs(Number(t2.amount))){
            
            // Check for DUPLICATES
            // if(t1.detailed_category === 'ACCOUNT_TRANSFER' && t1.detailed_category === 'ACCOUNT_TRANSFER'){
            //   const dt1 = DateTime.fromISO(t1.date)
            //   const dt2 = DateTime.fromISO(t2.date)
            //   const diff = Interval.fromDateTimes(dt1, dt2).length('days')
            //   if(Number(t1.amount) + Number(t2.amount) === 0 && diff < 2){
            //     await prisma.transactions.updateMany({
            //       where: { 
            //         OR: [{ id: t1.id }, { id: t2.id }]
            //       },
            //       data: { 
            //         active: false
            //       }
            //     })
            //   }
            // }
            
            // Check for RECURRING TRANSACTIONS
            if(t1.month_year !== t2.month_year){
              if(Number(t1.amount) === Number(t2.amount) && t1.name === t2.name){
                await updateItems(t1, t2)
              } else if(t1?.custom_name){
                if(Number(t1.amount) === Number(t2.amount) && t1?.custom_name === t2?.custom_name){
                  await updateItems(t1, t2)
                }
              }
            }
          }
        }
      })
    })
  },
});