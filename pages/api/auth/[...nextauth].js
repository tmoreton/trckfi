import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const authOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        dkim: {
          domainName: "trckfi.com",
          keySelector: "rsa",
          privateKey: process.env.EMAIL_KEY
        },
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      from: process.env.EMAIL_ADDRESS
    })
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
}

export default NextAuth(authOptions)