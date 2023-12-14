import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { render } from '@react-email/render'
import BetaInvite from "../emails/beta_invite"
import Welcome from "../emails/welcome_email"
import BetaNoSignup from "../emails/beta_no_signup"
import NoAccounts from "../emails/signup_no_accounts"
import prisma from '../lib/prisma'
const nodemailer = require('nodemailer')

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {

    let users = await prisma.user.findMany({
      where: {
        active: true,
      }
    })
  
    let accounts = await prisma.plaid.groupBy({
      by: ['user_id'],
    })
    let strings = accounts.map(a => a.user_id)
  
    const users_no_accounts = users.filter(item => !strings.includes(item.id))

    for (let i in users_no_accounts) {
      console.log(users_no_accounts[i].email)
    }
  },

    // const { email, type } = payload

    // let message
    // if(type === 'welcome'){
    //   message = {
    //     from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
    //     to: email,
    //     subject: `Welcome to Trckfi!`,
    //     text: '',
    //     html: render(<Welcome />),
    //   }
    // }
    // if(type === 'beta') {
    //   message = {
    //     from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
    //     to: email,
    //     subject: `You're invited to be a Trckfi early adopter!`,
    //     text: '',
    //     html: render(<BetaInvite />),
    //   }
    // }
    // if(type === 'followup') {
    //   message = {
    //     from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
    //     to: email,
    //     subject: `Does this sound familiar?`,
    //     text: '',
    //     html: render(<BetaNoSignup />),
    //   }
    // }

    // if(type === 'no_accounts') {
    //   message = {
    //     from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
    //     to: email,
    //     subject: `Howdy friend! 👋`,
    //     text: '',
    //     html: render(<NoAccounts />),
    //   }
    // }

    // let transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // })

    // await transporter.sendMail(message)
  },
});

