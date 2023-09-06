import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "update-crypto-price",
  name: "Update Crypto Price",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 9 * * *",
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
        subtype: 'crypto',
        user_id: { in: ids }
      },
    })

    for (let i in accounts) {
      if(accounts[i].details){
         // @ts-ignore
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${accounts[i].details.id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })
        const { market_data } = await response.json()
        // @ts-ignore
        let total = Number(market_data?.current_price?.usd)*Number(accounts[i].details.quantity)
        await prisma.accounts.update({
          where: { id: accounts[i].id },
          data: { 
            amount: Number(total)
          }
        })
      } 
    }
  },
});
