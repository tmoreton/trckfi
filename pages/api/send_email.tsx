// eslint-disable-next-line import/no-anonymous-default-export
const nodemailer = require('nodemailer')
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { email, message } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  if (email === '' || !email.match(emailFormat)) {
    return res.status(400).json({ error: 'Invalid Email' })
  }

  const body = {
    from: process.env.EMAIL_ADDRESS,
    to: 'support@trckfi.com',
    subject: `Feedback From: ${email}`,
    html: `<p>${message}</p>`,
  }

  slackMessage(`Feedback From: ${email} Message: ${message}`)

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    await transporter.sendMail(body)
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error send_email: ' + e.message || e.toString())
    throw new Error(e)
  }
}
