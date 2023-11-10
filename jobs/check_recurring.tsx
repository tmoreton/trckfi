import { cronTrigger, eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime, Interval } from "luxon"

client.defineJob({
  id: "check-recurring",
  name: "check-recurring",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "check.recurring"
  }),
  run: async (payload, io, ctx) => {
    const startDate = DateTime.now().minus({ months: 2 }).startOf('month').toISO()

    const checkName = (a, b) => {
      if(a.name === b.name){
        return true
      } else if(a.custom_name && b.custom_name && a.custom_name === b.custom_name) {
        return true
      }
    }

    const between = (t1, t2) => {
      let a = Number(t1.amount)
      let b = Number(t2.amount)
      let min = a*.05 - a
      let max = a*.05 + a
      return b >= min && b <= max;
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        pending: false,
        date: {
          gte: startDate
        },
      }
    })

    transactions.forEach((t1) => {
      transactions.forEach(async (t2) => {
        if(t1.user_id === t2.user_id){
          if(t1.transaction_id !== t2.transaction_id && Math.abs(Number(t1.amount)) === Math.abs(Number(t2.amount))){
            
            // Check for DUPLICATES
            if(t1.detailed_category === 'ACCOUNT_TRANSFER' && t2.detailed_category === 'ACCOUNT_TRANSFER'){
              const dt1 = DateTime.fromISO(t1.date)
              const dt2 = DateTime.fromISO(t2.date)
              const diff = Interval.fromDateTimes(dt1, dt2).length('days')
              if(Number(t1.amount) + Number(t2.amount) === 0 && diff < 2){
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
            
            // Check for RECURRING TRANSACTIONS
            if(t1.month_year !== t2.month_year && checkName(t1, t2)){
              await prisma.transactions.update({
                where: { id: t1.id },
                data: {
                  recurring: true,
                  upcoming_date: DateTime.fromISO(t1.date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
                },
              })
              await prisma.transactions.update({
                where: { id: t2.id },
                data: {
                  recurring: true,
                  upcoming_date: DateTime.fromISO(t2.date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
                },
              })
            }
          }
        }
      })
    })
  },
});