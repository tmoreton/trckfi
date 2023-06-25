import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const nodemailer = require('nodemailer')
const prisma = new PrismaClient()
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { render } from '@react-email/render';
import EmailTemplate from "../../../react-email-starter/emails/vercel-invite-user";

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
        const transport = nodemailer.createTransport(server)
        const emailHtml = render(<EmailTemplate url={url}/>)
        await transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          html: emailHtml,
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

const Email = ({url}) => {
  return (
    <Html lang="en">
      <Button href={url} style={{ color: "#61dafb" }}>
        Login
      </Button>
    </Html>
  );
};

export default NextAuth(authOptions)