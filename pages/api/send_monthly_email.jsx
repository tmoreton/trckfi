// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import MonthlySummary from "../../emails/monthly_summary"
import prisma from '../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  try {
  const activeUsers = await prisma.user.findMany({
    where: { 
      active: true,
      stripeSubscriptionId: {
        not: null
      }
    }
  })

  for (let a in activeUsers) {
      const user_id = activeUsers[a].id
      const email = activeUsers[a].email

      const lastMonthIncome = await prisma.transactions.aggregate({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
          },
          primary_category: 'INCOME'
        },
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
      })

      const thisMonthIncome = await prisma.transactions.aggregate({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          },
          primary_category: 'INCOME'
        },
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
      })

      const lastMonthTotal = await prisma.transactions.aggregate({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' },
          ],
        },
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
      })

      const thisMonthTotal = await prisma.transactions.aggregate({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' },
          ],
        },
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
      })

      const categories = await prisma.transactions.groupBy({
        by: ['detailed_category'],
        where: {
          user_id: user_id,
          date: {
            lte: DateTime.now().startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
          ],
        },
        _sum: {
          amount: true,
        },
      })

      const thisMonth = await prisma.transactions.findMany({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' }
          ],
        },
        orderBy: {
          amount: 'desc'
        },
      })

      const lastMonth = await prisma.transactions.findMany({
        where: {
          user_id: user_id,
          active: true,
          date: {
            lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
            gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' }
          ],
        },
        orderBy: {
          amount: 'desc'
        },
      })

      let recurring = []
      lastMonth.forEach((i) => {
        let obj = thisMonth.find((x) => {
          return Number(i.amount) === Number(x.amount)
        })
        if(obj){
          recurring.push(obj)
        }
      })

      const emailHtml = render(
        <MonthlySummary 
          month={DateTime.local().monthLong} 
          thisMonth={thisMonth.slice(0, 10)} 
          categories={categories} 
          thisMonthTotal={thisMonthTotal} 
          lastMonthTotal={lastMonthTotal} 
          thisMonthIncome={thisMonthIncome} 
          lastMonthIncome={lastMonthIncome}
          recurring={recurring}
        />
      )
      
      const message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: `Trckfi - ${DateTime.local().monthLong} Summary`,
        text: '',
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

      await transporter.sendMail(message)
    }
    
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
