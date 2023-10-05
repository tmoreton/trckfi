import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import prisma from '../lib/prisma';
const nodemailer = require('nodemailer')
import { render } from '@react-email/render'
import BetaEmail from "../emails/beta_email"

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {
    const { email } = payload
    const emailHtml = render(
      <BetaEmail />
    )
    
    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Welcome to Trckfi Beta!`,
      text: '',
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
  },
});
