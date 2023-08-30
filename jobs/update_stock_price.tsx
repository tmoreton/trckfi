import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import yahooFinance from 'yahoo-finance2';

client.defineJob({
  id: "update-stock-price",
  name: "Update Stock Price",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 19 * * *",
  }),
  run: async (payload, io, ctx) => {
    const users = await prisma.user.findMany({
      where: {
        active: true,
      }
    })
    const ids = users.map(user => user.id)
    const accounts = await prisma.accounts.findMany({
      where: {
        active: true,
        subtype: 'equity',
        user_id: { in: ids }
      },
    })

    for (let i in accounts) {
      // @ts-ignore
      const { regularMarketPrice } = await yahooFinance.quote(accounts[i].details.symbol)
      await prisma.accounts.update({
        where: { id: accounts[i].id },
        data: { 
          // @ts-ignore
          amount: Number(regularMarketPrice)*Number(accounts[i].details.quantity)
        }
      })
    }
  },
});
