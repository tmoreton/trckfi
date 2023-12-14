import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "hourly-sync",
  name: "hourly-sync",
  version: "0.0.1",
  enabled: true,
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
        user_id: { in: ids },
        error_code: null
      },
    })

    for (let p in plaid) {    
      await client.sendEvent({
        name: "sync.plaid",
        payload: { access_token: plaid[p].access_token, item_id: plaid[p].item_id, user_id: plaid[p].user_id, institution: plaid[p].institution },
      })
    }
  },
});
