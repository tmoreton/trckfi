import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { render } from '@react-email/render'
import BetaInvite from "../emails/beta_invite"
import Welcome from "../emails/welcome_email"
import BetaNoSignup from "../emails/beta_no_signup"
import prisma from '../lib/prisma';

const nodemailer = require('nodemailer')

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {
    const { email, type } = payload

    let message
    if(type === 'welcome'){
      message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: `Welcome to Trckfi!`,
        text: '',
        html: render(<Welcome />),
      }
    }
    if(type === 'beta') {
      message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: `You're invited to be a Trckfi early adopter!`,
        text: '',
        html: render(<BetaInvite />),
      }
    }
    if(type === 'followup') {
      message = {
        from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
        to: email,
        subject: `Does this sound familiar?`,
        text: '',
        html: render(<BetaNoSignup />),
      }
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
    
  // const emails = await prisma.emails.findMany({
  //   where: {
  //   },
  // })
  
  // emails.forEach(async (i) => {
  //   const message = {
  //     from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
  //     to: i.email,
  //     subject: `Welcome to Trckfi Beta!`,
  //     text: '',
  //     html: render(<BetaEmail />),
  //   }
  
  //   let transporter = nodemailer.createTransport({
  //     host: process.env.SMTP_HOST,
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASSWORD,
  //     },
  //   })
  
  //   await transporter.sendMail(message)
  //   await prisma.emails.update({
  //     where: { id: i.id },
  //     // @ts-ignore
  //     data: { beta_sent: true }
  //   })
  // })

  },
});

