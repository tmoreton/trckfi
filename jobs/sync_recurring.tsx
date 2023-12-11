import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime } from "luxon"

client.defineJob({
  id: "sync-recurring",
  name: "sync-recurring",
  version: "0.0.1",
  enabled: true,
  trigger: cronTrigger({
    cron: "0 6 1 * *",
  }),
  run: async (payload, io, ctx) => {
    const startDate = DateTime.now().minus({ months: 2 }).startOf('month').toISO()
    const endDate = DateTime.now().minus({ months: 2 }).endOf('month').toISO()

    const startDateLast = DateTime.now().minus({ months: 1 }).startOf('month').toISO()
    const endDateLast = DateTime.now().minus({ months: 1 }).endOf('month').toISO()

    const transactions1 = await prisma.transactions.findMany({
      where: {
        date: {
          gte:  startDate,
        },
      }
    })

    // const transactions2 = await prisma.transactions.findMany({
    //   where: {
    //     date: {
    //       gte:  startDateLast,
    //       lte:  endDateLast
    //     },
    //   }
    // })

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

    transactions1.forEach(async (t1) => {
      // Check for next credit card payment
      if(t1.detailed_category === 'CREDIT_CARD_PAYMENT'){
        await prisma.transactions.update({
          where: { id: t1.id },
          data: {
            recurring: true,
            upcoming_date: DateTime.fromISO(t1.date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
          },
        })
      }
      transactions1.forEach(async (t2) => {
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
              console.log(`Found duplicate: ${t1.name}: ${Number(t1.amount)} and ${t2.name}: ${Number(t2.amount)}`)
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