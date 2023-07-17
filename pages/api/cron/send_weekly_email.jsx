// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import WeeklySummary from "../../../emails/weekly_summary"
import prisma from '../../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  try {
    const date = DateTime.now()
    const this_week = `${date.year}-${date.minus({ days: 3 }).weekNumber}`
    const last_week = `${date.year}-${date.minus({ days: 9 }).weekNumber}`

    const activeUsers = await prisma.user.findMany({
      where: { 
        active: true,
        subscription_id: {
          not: null
        }
      }
    })

    for (let a in activeUsers) {
      const user_id = activeUsers[a].id
      const linked_user_id = activeUsers[a].linked_user_id
      let linked_user_email;
      if(linked_user_id){
        const res = await prisma.user.findUnique({
          where: { 
            id: linked_user_id,
            active: true
          }
        })
        linked_user_email = res.email
      }
      const email = activeUsers[a].email
      const user_query = linked_user_id ? [{ user_id: user_id }, { user_id: linked_user_id }] : [{ user_id: user_id }]

      const groupByWeek = await prisma.transactions.groupBy({
        by: ['week_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { week_year: this_week },
            { week_year: last_week },
          ],
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
        orderBy: {
          week_year: 'desc'
        },
      })

      const primary = await prisma.transactions.groupBy({
        by: ['primary_category', 'week_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { week_year: this_week },
            { week_year: last_week },
          ],
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' },
          ],
        },
        _sum: {
          amount: true,
        }
      })
      let primaryCategories = []
      primary.forEach(p => {
        if(p.week_year === this_week){
          let item = primary.filter((i) => i.week_year === last_week && i.primary_category === p.primary_category)[0]
          primaryCategories.push({
            category: p.primary_category.split('_').join(' '),
            this_week_amount: p._sum.amount,
            last_week_amount: item?._sum.amount
          })
        }
      })
      primaryCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

      const detailed = await prisma.transactions.groupBy({
        by: ['detailed_category', 'week_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { week_year: this_week },
            { week_year: last_week },
          ],
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' },
          ],
        },
        _sum: {
          amount: true,
        }
      })
      let detailedCategories = []
      detailed.forEach(p => {
        if(p.week_year === this_week){
          let item = detailed.filter((i) => i.week_year === last_week && i.detailed_category === p.detailed_category)[0]
          detailedCategories.push({
            category: p.detailed_category.split('_').join(' '),
            this_week_amount: p._sum.amount,
            last_week_amount: item?._sum.amount
          })
        }
      })
      detailedCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

      const t = await prisma.transactions.findMany({
        where: {
          OR: user_query,
          active: true,
          OR: [
            { week_year: this_week },
          ],
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
          ],
        },
        orderBy: {
          amount: 'asc'
        }
      })
      const transactions = t.slice(0, 10)

      const emailHtml = render(
        <WeeklySummary 
          groupByWeek={groupByWeek} 
          transactions={transactions} 
          primaryCategories={primaryCategories} 
          detailedCategories={detailedCategories} 
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
      if(linked_user_email){
        await transporter.sendMail({
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          to: linked_user_email,
          subject: `Trckfi - Weekly Summary`,
          text: '',
          html: emailHtml,
        })
      }
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}