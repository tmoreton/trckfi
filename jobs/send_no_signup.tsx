import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { render } from '@react-email/render'
import BetaNoSignup from "../emails/beta_no_signup"
import prisma from '../lib/prisma'
const nodemailer = require('nodemailer')

client.defineJob({
  id: "email-no-signup",
  name: "Email No Signup",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "email.nosignup"
  }),
  run: async (payload, io, ctx) => {
    let users = await prisma.user.findMany()
    let emails = await prisma.emails.findMany()
    let user_emails = emails.map(e => e.email)
    let user_strings = users.map(e => e.email)
    const users_no_signup = user_emails.filter(e => !user_strings.includes(e))
  
    for (let i in users_no_signup) {
      let message = {
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          to: users_no_signup[i],
          subject: `Does this sound familiar?`,
          text: '',
          html: render(<BetaNoSignup />),
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
  },
});

