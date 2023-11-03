import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import accountsSync from '../utils/accountsSync';
import transactionsSync from '../utils/transactionsSync';

client.defineJob({
  id: "trigger-plaid-sync",
  name: "trigger-plaid-sync",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "plaid.sync"
  }),
  run: async (payload, io, ctx) => {
    const { access_token, user_id } = payload
    await transactionsSync(access_token, user_id)
  },
});
