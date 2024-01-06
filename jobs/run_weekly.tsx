import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "run-weekly",
  name: "Run Weekly",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 11 * * 1",
  }),
  run: async (payload, io, ctx) => {
    const activeUsers = await prisma.user.findMany({
      where: { 
        active: true,
        subscription_id: {
          not: null
        }
      }
    })

    for (let a in activeUsers) {
      const user_id = activeUsers[a].id
      const linked_user_id = activeUsers[a].linked_user_id
      await client.sendEvent({ name: "sync.plaid", payload: { user_id: user_id }})
      if(linked_user_id){
        const res = await prisma.user.findUnique({
          where: { 
            id: linked_user_id,
            active: true
          }
        })
        if(res){
          await client.sendEvent({ name: "sync.plaid", payload: { user_id: res.id }})
        }
      }
    }
  },
});
