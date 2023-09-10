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
    to: 'tmoreton89@gmail.com',
    subject: `Feedback From: ${email}`,
    html: `<p>${message}</p>`,
  }

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
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
