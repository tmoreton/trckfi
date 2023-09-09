// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import Newsletter from "../../emails/newsletter"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  try {
    // @ts-ignore
    await prisma.emails.upsert({
      where: { email: email.toLowerCase() },
      update: { email: email.toLowerCase() },
      create: { email: email.toLowerCase() },
    })
    
    const emailHtml = render(
      <Newsletter />
    )

    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: email.toLowerCase(),
      subject: `Thanks for subscribing!`,
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
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
throw new Error(error)
  }
}
