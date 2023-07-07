// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import { DateTime } from "luxon";

export default async (req, res) => {
  try {
    const recurring1 = await prisma.transactions.findMany({
      where: {
        active: true,
        authorized_date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    const recurring2 = await prisma.transactions.findMany({
      where: {
        active: true,
        authorized_date: {
          lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
        },
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
        ],
      },
      orderBy: {
        amount: 'desc'
      },
    })

    let recurring = []
    recurring1.forEach((month1) => {
      let tarObj = recurring2.find((obj) => {
        return month1.name === obj.name;
      })
      if(tarObj){
        recurring.push(tarObj)
      }
    })

    console.log(recurring)

    return res.status(200).json({ status: 'ok'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}



