import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import prisma from '../lib/prisma';
import Alert from "../emails/alert"

client.defineJob({
  id: "send-alert",
  name: "Send Alert",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 11 * * *",
  }),
  run: async (payload, io, ctx) => {
    const start_date = new Date()
    const end_date = new Date(start_date.getTime() + 60 * 60 * 24 * 1000)
    const transactions = await prisma.transactions.findMany({
      where: {
        active: true,
        pending: false,
        alert_date: {
          lte: end_date,
          gte: start_date
        },
      },
      include: {
        user: true
      },
      orderBy: {
        date: 'desc'
      },
    })
    
    if(transactions.length > 0){
      for (let t in transactions) {
        const emailHtml = render(
          <Alert 
            transaction={transactions[t]}
          />
        )
        const message = {
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          // @ts-ignore
          to: transactions[t].user.email,
          subject: `Trckfi Reminder`,
          text: ``,
          html: emailHtml,
        }
    
        let transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        })
        await transporter.sendMail(message)
      }
    }
  },
});
