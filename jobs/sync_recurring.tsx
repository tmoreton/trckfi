import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime } from "luxon"

client.defineJob({
  id: "update-recurring",
  name: "update-recurring",
  version: "0.0.1",
  enabled: true,
  trigger: eventTrigger({
    name: "update.recurring"
  }),
  run: async (payload, io, ctx) => {
    const { user_id } = payload
    const startDate = DateTime.now().minus({ months: 2 }).startOf('month').toISO()

    const transactions1 = await prisma.transactions.findMany({
      where: {
        user_id,
        date: {
          gte:  startDate,
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

    transactions1.forEach((t1) => {
      transactions1.forEach(async (t2) => {
        if(t1.user_id === t2.user_id){
          if(t1.transaction_id !== t2.transaction_id && Math.abs(Number(t1.amount)) === Math.abs(Number(t2.amount))){

            // Check for next credit card payment
            if(t1.detailed_category === 'CREDIT_CARD_PAYMENT' && t2.detailed_category === 'CREDIT_CARD_PAYMENT'){
              await updateItems(t1, t2)
            }

            // Check for RECURRING TRANSACTIONS
            if(t1.month_year !== t2.month_year){
              await io.logger.info(`Found recurring: ${t1.name}: ${Number(t1.amount)} and ${t2.name}: ${Number(t2.amount)}`);
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