// eslint-disable-next-line import/no-anonymous-default-export
import nodemailer from 'nodemailer'
import { generate } from 'random-words'
import { render } from '@react-email/render'
import prisma from '../../../lib/prisma'
import { DateTime } from "luxon";

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
        NOT: [
          { primary_category: 'LOAN_PAYMENTS' },
          { primary_category: 'TRANSFER_IN' },
          { primary_category: 'TRANSFER_OUT' },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        date: 'desc'
      },
    })
    console.log(transactions)

    // const emailHtml = render(
    //   <LinkToken 
    //     signup_url={`${req.headers.origin}/auth/email-signin`}
    //     link_url={`${req.headers.origin}/link?access_code=${access_code}`}
    //     access_code={access_code}
    //     from_email={from_email}
    //   />
    // )
    
    // const message = {
    //   from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
    //   to: to_email,
    //   subject: 'Your Invited to Join Trckfi',
    //   text: `${from_email} Invited you to join them tracking their finances!`,
    //   html: emailHtml,
    // }

    // let transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   secure: false,
    //   auth: {
    //   user: process.env.EMAIL_ADDRESS,
    //   pass: process.env.EMAIL_PASSWORD,
    //   },
    // })

    // await transporter.sendMail(message)
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
