import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { render } from '@react-email/render'
import Newsletter from "../emails/newsletter"
import { getPostBySlug } from '../lib/api'
import markdownToHtml from '../lib/markdownToHtml'

const nodemailer = require('nodemailer')

client.defineJob({
  id: "one-off",
  name: "One Off",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "one.off"
  }),
  run: async (payload, io, ctx) => {
    const { email, slug } = payload

    const post = getPostBySlug(slug, [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'description',
      'coverImage',
      'keywords',
      'status',
      'publishedAt'
    ],
    'newsletters')
    const content = await markdownToHtml(post.content || '')

    const message = {
      from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Trckfi Weekly`,
      text: '',
      html: render(<Newsletter content={content}/>),
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