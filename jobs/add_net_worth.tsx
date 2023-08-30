import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "add-net-worth",
  name: "Add Net Worth",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 8 * * *",
  }),
  run: async (payload, io, ctx) => {
    let users = await prisma.user.findMany({
      where: {
        active: true,
      },
      include: {
        // @ts-ignore
        accounts: true
      }
    })

    for (let i in users) {
      let data = {
        user_id: users[i].id,
        // @ts-ignore
        accounts: users[i].accounts,
        stats: {
          net_worth: 0,
          assets: 0,
          liabilities: 0,
        },
        snapshot: {
          cash: 0,
          stocks: 0,
          crypto: 0,
          real_estate: 0,
          retirement: 0,
          auto: 0,
          other: 0
        }
      }

      // @ts-ignore
      if(users[i].accounts && users[i].accounts.length > 0){
        // @ts-ignore
        users[i].accounts.forEach(a => {
          if (a.type === 'loan' || a.type === 'credit'){
            data.stats.liabilities += Number(a.amount)
          } else {
            data.stats.assets += Number(a.amount)
          }
          
          if (a.type === 'depository' || a.type === 'credit'){
            data.snapshot.cash += Math.round(Number(a.amount))
          }
  
          // Compare real estate value minus mortgage
          if (a.subtype === 'mortgage' || a.subtype === 'real_estate' || a.subtype === 'real estate'){
            data.snapshot.real_estate += Math.round(Number(a.amount))
          }
  
          //Account for all investments
          if (a.type === 'investment'){
            if(a.subtype === 'brokerage' || a.subtype === 'etf' || a.subtype === 'equity'){
              data.snapshot.stocks += Math.round(Number(a.amount))
            } else if (a.subtype === 'ira' || a.subtype === '401k'){
              data.snapshot.retirement += Math.round(Number(a.amount))
            } else if (a.subtype === 'crypto'){
              data.snapshot.crypto += Math.round(Number(a.amount))
            } else if (a.subtype !== 'real_estate' && a.subtype !== 'real estate') {
              data.snapshot.other += Math.round(Number(a.amount))
            }
          }
        })
        data.stats.net_worth = Math.round(Number(data.stats.assets - (-data.stats.liabilities)))
        await prisma.netWorth.create({ data })
      }
    }
  },
});
