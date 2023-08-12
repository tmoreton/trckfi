// eslint-disable-next-line import/no-anonymous-default-export
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import prisma from '../../../lib/prisma'
import Alert from "../../../emails/alert"

export default async (req, res) => {
  try {
    const start_date = new Date()
    const end_date = new Date(start_date.getTime() + 60 * 60 * 24 * 1000)
    const transactions = await prisma.transactions.findMany({
      where: {
        active: true,
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
          host: process.env.EMAIL_HOST,
          secure: false,
          auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
          },
        })
        await transporter.sendMail(message)
      }
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
