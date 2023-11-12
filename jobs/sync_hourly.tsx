import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-hourly",
  name: "Hourly Sync",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "*/10 * * * *",
  }),
  run: async (payload, io, ctx) => {
    const webhook = await prisma.webhooks.findFirst({
      where: {
        webhook_code: { in: ['SYNC_UPDATES_AVAILABLE', 'RECURRING_TRANSACTIONS_UPDATE'] },
      },
      orderBy: {
        created_at: 'asc'
      }
    })
    if(webhook?.item_id){
      const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id: webhook.item_id }})
      switch (webhook.webhook_code) {
        case 'SYNC_UPDATES_AVAILABLE':
          await prisma.webhooks.delete({
            where: {
              id: webhook.id
            }
          })
          await transactionsSync(access_token, user_id)  
          break;
        default:
          break;
      }
    }
  },
});
