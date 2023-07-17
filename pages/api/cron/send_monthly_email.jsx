// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import MonthlySummary from "../../../emails/monthly_summary"
import prisma from '../../../lib/prisma';
import { DateTime } from "luxon";

export default async (req, res) => {
  try {
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
      const email = activeUsers[a].email
      const linked_user_id = activeUsers[a].linked_user_id

      const date = DateTime.now()
      const this_month = date.toFormat('yyyy-MM')
      const last_month = date.minus({ months: 1 }).toFormat('yyyy-MM')

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
      const user_query = linked_user_id ? [{ user_id: user_id }, { user_id: linked_user_id }] : [{ user_id: user_id }]

      const groupByMonth = await prisma.transactions.groupBy({
        by: ['month_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { month_year: this_month },
            { month_year: last_month },
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
          month_year: 'desc'
        },
      })

      const groupByMonthIncome = await prisma.transactions.groupBy({
        by: ['month_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { month_year: this_month },
            { month_year: last_month },
          ],
          primary_category: 'INCOME'
        },
        _sum: {
          amount: true,
        },
        _count: {
          amount: true,
        },
        orderBy: {
          month_year: 'desc'
        },
      })

      const primary = await prisma.transactions.groupBy({
        by: ['primary_category', 'month_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { month_year: this_month },
            { month_year: last_month },
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
        if(p.month_year === this_month){
          let item = primary.filter((i) => i.month_year === last_month && i.primary_category === p.primary_category)[0]
          primaryCategories.push({
            category: p.primary_category.split('_').join(' '),
            this_month_amount: p._sum.amount,
            last_month_amount: item?._sum.amount
          })
        }
      })
      primaryCategories.sort((a, b) => a.this_month_amount-b.this_month_amount)
      primaryCategories = primaryCategories.slice(0, 10)

      const detailed = await prisma.transactions.groupBy({
        by: ['detailed_category', 'month_year'],
        where: {
          OR: user_query,
          active: true,
          OR: [
            { month_year: this_month },
            { month_year: last_month },
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
        if(p.month_year === this_month){
          let item = detailed.filter((i) => i.month_year === last_month && i.detailed_category === p.detailed_category)[0]
          detailedCategories.push({
            category: p.detailed_category.split('_').join(' '),
            this_month_amount: p._sum.amount,
            last_month_amount: item?._sum.amount
          })
        }
      })
      detailedCategories.sort((a, b) => a.this_month_amount-b.this_month_amount)
      detailedCategories = detailedCategories.slice(0, 10)

      const t = await prisma.transactions.findMany({
        where: {
          OR: user_query,
          active: true,
          month_year: this_month,
          NOT: [
            { primary_category: 'LOAN_PAYMENTS' },
            { primary_category: 'TRANSFER_IN' },
            { primary_category: 'TRANSFER_OUT' },
            { primary_category: 'INCOME' },
          ],
        },
        orderBy: {
          amount: 'asc'
        }
      })
      const transactions = t.slice(0, 10)

      const emailHtml = render(
        <MonthlySummary 
          groupByMonth={groupByMonth} 
          groupByMonthIncome={groupByMonthIncome} 
          primaryCategories={primaryCategories} 
          detailedCategories={detailedCategories} 
          transactions={transactions} 
          recurring={[]} 
          email={email}
          this_month={this_month}
          last_month={last_month}
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
      if(linked_user_email){
        await transporter.sendMail({
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          to: linked_user_email,
          subject: `Trckfi - ${DateTime.local().monthLong} Summary`,
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
