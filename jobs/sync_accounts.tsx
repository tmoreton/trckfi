import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import prisma from '../lib/prisma';

client.defineJob({
  id: "sync-accounts",
  name: "Sync Plaid Accounts",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.accounts"
  }),
  run: async (payload, io, ctx) => {
    // const { access_token, item_id, user_id, institution } = payload
    // await accountsSync(access_token, item_id, user_id, institution)
    const { webhook_code, item_id } = payload
    // @ts-ignore
    await prisma.webhooks.create({ webhook_code, item_id })
  },
});
