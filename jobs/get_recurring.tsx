import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import recurringSync from '../utils/recurringSync';

client.defineJob({
  id: "get-recurring",
  name: "Recurring Transactions",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 6 * * *",
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
      await recurringSync(plaid[p].access_token)
    }
  },
});
