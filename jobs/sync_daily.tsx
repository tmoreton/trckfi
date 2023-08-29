import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-daily",
  name: "Sync All Active Plaid Transactions",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 8 * * *",
  }),
  run: async (payload, io, ctx) => {
    const start_date = new Date()
    const end_date = new Date(start_date.getTime() + 60 * 60 * 24 * 1000)
    let users = await prisma.user.findMany({
      where: {
        active: true,
      }
    })
    const ids = users.map(user => user.id)
    const plaid = await prisma.plaid.findMany({
      where: {
        active: true,
        user_id: { in: ids }
      },
    })

    for (let p in plaid) {
      console.log(plaid[p])
      client.sendEvent({
        name: "sync.accounts",
        payload: { access_token: plaid[p].access_token, item_id: plaid[p].item_id, user_id: plaid[p].user_id, institution: plaid[p].institution },
      })
      client.sendEvent({
        name: "sync.transactions",
        payload: { access_token: plaid[p].access_token, user_id: plaid[p].user_id },
      })
    }
  },
});