import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import WeeklySummary from "../emails/weekly_summary"
import prisma from '../lib/prisma';
import { DateTime } from "luxon";

client.defineJob({
  id: "weekly-email",
  name: "Weekly Email",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 11 * * 1",
  }),
  run: async (payload, io, ctx) => {
    const date = DateTime.now()
    const this_week = `${date.year}-${date.minus({ days: 3 }).weekNumber}`
    const last_week = `${date.year}-${date.minus({ days: 9 }).weekNumber}`

    const activeUsers = await prisma.user.findMany({
      where: { 
        active: true,
        email_weekly: true,
        email: 'tmoreton89@gmail.com',
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
          AND: [ 
            { OR: user_query }, 
            { OR: [{ week_year: this_week }, { week_year: last_week }] } 
          ],
          active: true,
          pending: false,
          NOT: [
            { primary_category: 'INCOME' },
            { detailed_category: 'CREDIT_CARD_PAYMENT' },
            { 
              name: {
                contains: 'transfer',
                mode: 'insensitive'
              }
            },
          ],
          amount: {
            lte: 0,
          },
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
          AND: [ 
            { OR: user_query }, 
            { OR: [{ week_year: this_week }, { week_year: last_week }] } 
          ],
          active: true,
          pending: false,
          NOT: [
            { primary_category: 'INCOME' },
            { detailed_category: 'CREDIT_CARD_PAYMENT' },
            { 
              name: {
                contains: 'transfer',
                mode: 'insensitive'
              }
            },
          ],
          amount: {
            lte: 0,
          },
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
            this_week_amount: p?._sum?.amount,
            last_week_amount: item?._sum?.amount
          })
        }
      })
      primaryCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

      const detailed = await prisma.transactions.groupBy({
        by: ['detailed_category', 'week_year'],
        where: {
          AND: [ 
            { OR: user_query }, 
            { OR: [{ week_year: this_week }, { week_year: last_week }] } 
          ],
          active: true,
          pending: false,
          NOT: [
            { primary_category: 'INCOME' },
            { detailed_category: 'CREDIT_CARD_PAYMENT' },
            { 
              name: {
                contains: 'transfer',
                mode: 'insensitive'
              }
            },
          ],
          amount: {
            lte: 0,
          },
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
            this_week_amount: p?._sum?.amount,
            last_week_amount: item?._sum?.amount
          })
        }
      })
      detailedCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

      const transactions = await prisma.transactions.findMany({
        where: {
          OR: user_query,
          active: true,
          pending: false,
          week_year: this_week,
          NOT: [
            { primary_category: 'INCOME' },
            { detailed_category: 'CREDIT_CARD_PAYMENT' },
            { 
              name: {
                contains: 'transfer',
                mode: 'insensitive'
              }
            },
          ],
        },
        orderBy: {
          amount: 'asc'
        },
        take: 5
      })

      let upcomingTransactions = await prisma.transactions.findMany({
        where: {
          OR: user_query,
          pending: false,
          active: true,
          upcoming_date: {
            gte: DateTime.now().toISO()
          },
          NOT: [
            { detailed_category: 'CREDIT_CARD_PAYMENT' },
            { 
              name: {
                contains: 'transfer',
                mode: 'insensitive'
              }
            },
          ],
        },
        include: {
          account: true
        },
        orderBy: {
          upcoming_date: 'asc'
        },
        take: 5
      })

      if(transactions && transactions?.length > 0){
        const emailHtml = render(
          <WeeklySummary 
            groupByWeek={groupByWeek} 
            transactions={transactions} 
            primaryCategories={primaryCategories} 
            detailedCategories={detailedCategories}
            recurring={upcomingTransactions}
          />
        )
  
        let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        })
  
        await transporter.sendMail({
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: `Trckfi - Weekly Summary`,
          text: '',
          html: emailHtml,
        })
  
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
    }
  },
});
