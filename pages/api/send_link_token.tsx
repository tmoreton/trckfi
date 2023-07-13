// eslint-disable-next-line import/no-anonymous-default-export
import nodemailer from 'nodemailer'
import { generate } from 'random-words'
import { render } from '@react-email/render'
import prisma from '../../lib/prisma'
import LinkToken from "../../emails/link_token"
import { DateTime } from "luxon";

export default async (req, res) => {
  const { user_id, from_email, to_email } = req.body
  
  if (!to_email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  if (!user_id) {
    return res.status(400).json({ error: 'User Is Required' })
  }

  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  if (to_email === '' || !to_email.match(emailFormat)) {
    return res.status(400).json({ error: 'Invalid Email' })
  }

  try {
    const access_code = generate({ exactly: 5, join: '-' })
    const expires = DateTime.now().plus({hours: 24}).toISO()

    // await prisma.linkTokens.create({
    //   data: {
    //     to_email: to_email.toLowerCase(),
    //     from_email: from_email.toLowerCase(),
    //     user_id,
    //     access_code,
    //     expires
    //   },
    // })
    await prisma.linkTokens.upsert({
      where: { 
        user_id,
        to_email: to_email.toLowerCase()
      },
      update: {
        to_email: to_email.toLowerCase(),
        from_email: from_email.toLowerCase(),
        user_id,
        access_code,
        expires
      },
      create: { 
        to_email: to_email.toLowerCase(),
        from_email: from_email.toLowerCase(),
        user_id,
        access_code,
        expires
      },
    })

    const emailHtml = render(
      <LinkToken 
        signup_url={`${req.headers.origin}/auth/email-signin`}
        link_url={`${req.headers.origin}/link?access_code=${access_code}`}
        access_code={access_code}
        from_email={from_email}
      />
    )
    
    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: to_email,
      subject: 'Your Invited to Join Trckfi',
      text: `${from_email} Invited you to join them tracking their finances!`,
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
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
