import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import transactionsSync from '../utils/transactionsSync';
import accountsSync from '../utils/accountsSync';

client.defineJob({
  id: "sync-transactions",
  name: "Sync Plaid Transactions",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.transactions"
  }),
  run: async (payload, io, ctx) => {
    const { access_token, user_id, item_id, institution } = payload
    await io.logger.log("syncing transaction");
    await transactionsSync(access_token, user_id)
    await io.logger.log("syncing accounts");
    await accountsSync(access_token, item_id, user_id, institution)
  },
});
