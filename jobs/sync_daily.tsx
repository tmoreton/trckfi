import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-daily",
  name: "Daily Sync Transactions",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 10 * * *",
  }),
  run: async (payload, io, ctx) => {
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
      // await accountsSync(plaid[p].access_token, plaid[p].item_id, plaid[p].user_id, plaid[p].institution)
      // await transactionsSync(plaid[p].access_token, plaid[p].user_id)
      await io.sendEvent("sync.transactions", {
        name: "sync.transactions",
        payload: { access_token: plaid[p].access_token, user_id: plaid[p].user_id },
      });
    }
  },
});
