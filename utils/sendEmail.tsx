// eslint-disable-next-line import/no-anonymous-default-export
import slackMessage from '../utils/slackMessage'
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import WelcomeEmail from "../emails/welcome_email"

const sendEmail = async (email) => {
  try {
    slackMessage(`${email} Recieved Welcome Email`)

    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: email.toLowerCase(),
      subject: `Start Using Trckfi Now: Reach Your Money Goals Faster!`,
      text: '',
      html: render(<WelcomeEmail />),
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
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
    throw new Error(error)
  }
}

export default sendEmail