import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import transactionsSync from '../utils/transactionsSync'
import netWorthSync from '../utils/netWorthSync'
import accountsSync from '../utils/accountsSync'

client.defineJob({
  id: "sync-plaid",
  name: "sync-plaid",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.plaid"
  }),
  run: async (payload, io, ctx) => {
    const { access_token, item_id, user_id, institution } = payload
    // await accountsSync(access_token, item_id, user_id, institution)
    // await netWorthSync(user_id)
    await transactionsSync(access_token, user_id)
    await io.logger.info("Syncing Transactions");
  },
});

