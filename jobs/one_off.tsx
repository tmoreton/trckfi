import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {
    let users = await prisma.user.findMany()

    for (let i in users) {
      await prisma.emails.upsert({
        where: { email: users[i].email },
        update: {},
        create: { email: users[i].email }
      })
    }
  },
});
