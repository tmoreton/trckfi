// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import WeeklySummaryEmail from "../../emails/weekly_summary"
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  // const { email } = req.body
  const email = 'tmoreton89@gmail.com'

  const user = await prisma.user.findUnique({
    where: { email: email },
  })

  const thisMonth = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().toISO(),
        gte: DateTime.now().startOf('month').toISO(),
      },
      NOT: {
        primary_category: 'LOAN_PAYMENTS',
      },
    },
    orderBy: {
      authorized_date: 'desc'
    }
  })

  const lastMonth = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
      },
      NOT: {
        primary_category: 'LOAN_PAYMENTS',
      },
    }
  })

  const thisWeek = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().toISO(),
        gte: DateTime.now().startOf('week').toISO(),
      },
      NOT: {
        primary_category: 'LOAN_PAYMENTS',
      },
    },
    orderBy: {
      authorized_date: 'asc'
    }
  })

  const lastWeek = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().startOf('week').toISO(),
        gte: DateTime.now().minus({ week: 1 }).startOf('week').toISO(),
      },
      NOT: {
        primary_category: 'LOAN_PAYMENTS',
      },
    },
    orderBy: {
      authorized_date: 'asc'
    }
  })

  const accounts = await prisma.accounts.findMany({
    where: { 
      user_id: user.id,
      active: true
    },
  })

  const emailHtml = render(<WeeklySummaryEmail accounts={accounts} thisMonth={thisMonth} lastMonth={lastMonth} thisWeek={thisWeek} lastWeek={lastWeek}/>)
  
  const message = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'Trcki Weekly Summary',
    html: emailHtml,
  }

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  try {
    await transporter.sendMail(message)
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
