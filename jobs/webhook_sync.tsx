import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "webhook-sync",
  name: "webhook-sync",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "*/5 * * * *",
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
      const { access_token, user_id, institution, item_id } = await prisma.plaid.findUnique({ where: { item_id: webhook.item_id }})
      switch (webhook.webhook_code) {
        case 'SYNC_UPDATES_AVAILABLE':
          await prisma.webhooks.delete({
            where: {
              id: webhook.id
            }
          })
          await client.sendEvent({
            name: "sync.plaid",
            payload: { access_token, item_id, user_id, institution },
          })
          break;
        default:
          break;
      }
    }
  },
});
