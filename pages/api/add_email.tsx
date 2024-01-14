// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import BetaInvite from "../../emails/beta_invite"
import Bundle from "../../emails/bundle"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { email, name, type } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  try {
    const user = await prisma.user.findFirst({
      where: { 
        email,
        active: true
      }
    })
    console.log(user)
    if(user) return res.redirect('/login')
    
    await prisma.emails.upsert({
      where: { email: email.toLowerCase() },
      update: { 
        email: email.toLowerCase(),
        name,
        // @ts-ignore
        source: type
      },
      create: { 
        email: email.toLowerCase(),
        name,
        // @ts-ignore
        source: type
      },
    })

    if(type === 'beta'){
      slackMessage(`${email} Recieved Beta Invite Email`)

      const message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email.toLowerCase(),
        subject: `Welcome to Trckfi!`,
        text: '',
        html: render(<BetaInvite />),
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

    if(type === 'bundle'){
      slackMessage(`${email} Recieved Bundle Email`)

      const message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email.toLowerCase(),
        subject: `The Expense Tracker is yours!`,
        text: '',
        html: render(<Bundle name={name} />),
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

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_email: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}
