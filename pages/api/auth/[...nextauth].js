import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const nodemailer = require('nodemailer')
const prisma = new PrismaClient()
import { render } from '@react-email/render';
import SignInEmail from "../../../emails/signin";
import SignInFirst from "../../../emails/signin-first";

export const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.EMAIL_ADDRESS,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const transport = nodemailer.createTransport(server)
        let user = await prisma.user.findUnique({
          where: { email },
        })

        if(user){
          if(!user?.emailVerified){
            const emailHtml = render(<SignInFirst url={url}/>)
            return await transport.sendMail({
              from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
              to: email,
              subject: `Welcome to 30-day Free Trial!`,
              html: emailHtml,
            });
          }
          const emailHtml = render(<SignInEmail url={url}/>)
          await transport.sendMail({
            from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: `Sign in to Trckfi`,
            html: emailHtml,
          });
        }
      },
      normalizeIdentifier(identifier) {
        // Get the first two elements only,
        // separated by `@` from user input.
        let [local, domain] = identifier.toLowerCase().trim().split("@")
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        domain = domain.split(",")[0]
        return `${local}@${domain}`
  
        // You can also throw an error, which will redirect the user
        // to the error page with error=EmailSignin in the URL
        if (identifier.split("@").length > 2) {
          throw new Error("Only one email allowed")
        }
      },
    })
  ],
  theme: {
    colorScheme: "light",
  },
  pages: {
    signIn: '/auth/email-signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error'
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  session: {
    // maxAge: 24 * 60 * 60, // 24 hours
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  callbacks: {
    async session(session, user) {
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return `${url}`
    }
  },
}

export default NextAuth(authOptions)