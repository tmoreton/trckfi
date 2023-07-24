import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
const nodemailer = require('nodemailer')
const prisma = new PrismaClient()
import { render } from '@react-email/render';
import SignInEmail from "../../../emails/signin";

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
        const transport = nodemailer.createTransport(server)
        const emailHtml = render(<SignInEmail url={url}/>)
        await transport.sendMail({
          from: `"Trckfi" <${process.env.EMAIL_ADDRESS}>`,
          to: email,
          subject: `Sign in to Trckfi`,
          html: emailHtml,
        });
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
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "database",
  
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    maxAge: 24 * 60 * 60, // 24 hours

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
    
    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex")
    }
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