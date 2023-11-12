import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";

client.defineJob({
  id: "backfill",
  name: "backfill",
  version: "0.0.1",
  enabled: false,
  trigger: eventTrigger({
    name: "backfill"
  }),
  run: async (payload, io, ctx) => {
  
  },
});
