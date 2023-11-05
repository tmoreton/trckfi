import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
import { DateTime } from "luxon"

client.defineJob({
  id: "backfill",
  name: "backfill",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "backfill"
  }),
  run: async (payload, io, ctx) => {
    const startDate = DateTime.now().toISO()
    const endDate = DateTime.now().startOf('year').toISO()
    await prisma.transactions.updateMany({
      where: {
        authorized_date: {
          lte: startDate,
          gte: endDate
        },
      },
      data: {
        year: '2023'
      },
    })
  },
});
