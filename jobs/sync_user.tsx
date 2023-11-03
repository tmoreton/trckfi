import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-user",
  name: "sync-user",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.user"
  }),
  run: async (payload, io, ctx) => {
    const { user_id } = payload
    const plaid = await prisma.plaid.findMany({
      where: {
        user_id
      },
    })
    
    for (let i in plaid) {
      // await accountsSync(plaid[p].access_token, plaid[p].item_id, plaid[p].user_id, plaid[p].institution)
      // await transactionsSync(plaid[p].access_token, plaid[p].user_id)
      await io.sendEvent("sync.transactions", {
        name: "sync.transactions",
        payload: { 
          access_token: plaid[i].access_token, 
          user_id: plaid[i].user_id 
        },
      });
    }
  },
});
