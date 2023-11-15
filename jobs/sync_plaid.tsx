import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import transactionsSync from '../utils/transactionsSync'

client.defineJob({
  id: "sync-plaid",
  name: "sync-plaid",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "sync.plaid"
  }),
  run: async (payload, io, ctx) => {
    const { access_token, user_id } = payload
    await transactionsSync(access_token, user_id)
    await io.logger.info("Syncing Transactions");
  },
});

