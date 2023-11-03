import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import transactionsSync from '../utils/transactionsSync';

client.defineJob({
  id: "sync-transactions",
  name: "Sync Plaid Transactions",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.transactions"
  }),
  run: async (payload, io, ctx) => {
    const { access_token, user_id } = payload
    await io.logger.log("syncing transaction", { access_token });
    transactionsSync(access_token, user_id)
  },
});
