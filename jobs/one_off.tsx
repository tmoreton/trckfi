import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { render } from '@react-email/render'
import BetaEmail from "../emails/beta_email"
const nodemailer = require('nodemailer')

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {
    const { email } = payload
    
    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Welcome to Trckfi Beta!`,
      text: '',
      html: render(<BetaEmail />),
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
