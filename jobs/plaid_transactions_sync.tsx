import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import transactionsSync from '../utils/transactionsSync';

client.defineJob({
  id: "plaid-transactions-sync",
  name: "Plaid Transactions",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "plaid.transactions"
  }),
  run: async (payload, io, ctx) => {
    console.log(payload)
    const { access_token, next_cursor, accounts, user_id } = payload
    transactionsSync(access_token, next_cursor, accounts, user_id)
  },
});
