import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';
import recurringSync from '../utils/recurringSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-hourly",
  name: "Hourly Sync",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "* * * * *",
  }),
  run: async (payload, io, ctx) => {
    const webhook = await prisma.webhooks.findFirst({
      orderBy: {
        created_at: 'asc'
      }
    })
    console.log(webhook.webhook_code)
    // const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id: webhook.item_id }})

    switch (webhook.webhook_code) {
      case 'SYNC_UPDATES_AVAILABLE':
        // await transactionsSync(access_token, user_id)        
        break;
      case 'RECURRING_TRANSACTIONS_UPDATE':
        // await recurringSync(access_token)
        break;
      default:
        break;
    }
  },
});
