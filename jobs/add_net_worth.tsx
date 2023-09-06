import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import netWorthSync from '../utils/netWorthSync';

client.defineJob({
  id: "add-net-worth",
  name: "Add Net Worth",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 11 * * *",
  }),
  run: async (payload, io, ctx) => {
    let users = await prisma.user.findMany({
      where: {
        active: true,
      },
      include: {
        accounts: true
      }
    })

    for (let i in users) {
      await netWorthSync(users[i].id)
    }
  },
});
