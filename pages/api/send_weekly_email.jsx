// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import WeeklySummary from "../../emails/weekly_summary"
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

      const groupByWeek = await prisma.transactions.groupBy({
        by: ['week_year'],
        where: {
          user_id: user_id,
          active: true,
          authorized_date: {
            lte: DateTime.now().toISO(),
            gte: DateTime.now().minus({ weeks: 2 }).startOf('week').toISO()
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
        _count: {
          amount: true,
        },
        orderBy: {
          week_year: 'desc'
        },
      })
    
      const categories = await prisma.transactions.groupBy({
        by: ['detailed_category'],
        where: {
          user_id: user_id,
          active: true,
          authorized_date: {
            lte: DateTime.now().toISO(),
            gte: DateTime.now().minus({ weeks: 1 }).startOf('week').toISO()
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' }
          ],
        },
        _sum: {
          amount: true,
        }
      })
    
      const transactions = await prisma.transactions.findMany({
        where: {
          user_id: user_id,
          active: true,
          authorized_date: {
            lte: DateTime.now().toISO(),
            gte: DateTime.now().minus({ weeks: 1 }).startOf('week').toISO()
          },
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
          ],
        },
        orderBy: {
          amount: 'desc'
        }
      })

      const emailHtml = render(
        <WeeklySummary 
          groupByWeek={groupByWeek} 
          transactions={transactions} 
          categories={categories} 
        />
      )
      
      const message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: `Trckfi - Weekly Summary`,
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
