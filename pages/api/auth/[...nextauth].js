import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const nodemailer = require('nodemailer')
const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      from: process.env.EMAIL_ADDRESS,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = nodemailer.createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          html: `<a href="${url}">signed up for the trckfi newsletter</p>`,
        });
      },
    })
  ],
  theme: {
    colorScheme: "light",
  },
  pages: {
    signIn: '/auth/email-signin',
    verifyRequest: '/auth/verify-request'
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session(session, user) {
      if(user){
        user.user_id = user.user?.id
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)