// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import WeeklySummaryEmail from "../../emails/weekly_summary"
import prisma from '../../lib/prisma';

export default async (req, res) => {
  // const { email } = req.body
  const email = 'tmoreton89@gmail.com'
  const emailHtml = render(<WeeklySummaryEmail />)

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
