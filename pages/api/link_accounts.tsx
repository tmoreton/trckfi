// eslint-disable-next-line import/no-anonymous-default-export
import nodemailer from 'nodemailer'
import { generate } from 'random-words'
import { render } from '@react-email/render'
import prisma from '../../lib/prisma'
import LinkToken from "../../emails/link_token"
import { DateTime } from "luxon";

export default async (req, res) => {
  const { access_code, user } = req.body

  try {
    const link_token = await prisma.linkTokens.findUnique({
      where: { 
        access_code: access_code, 
        to_email: user.email 
      }
    })

    if(!link_token) return res.status(200).json({ error: 'Couldnt find a matching token' })

    const linked_user = await prisma.user.upsert({
      where: { id: link_token.user_id },
      update: { linkedUserId: user.id },
      create: {},
    })

    await prisma.user.upsert({
      where: { id: user.id },
      update: { linkedUserId: linked_user.id },
      create: {},
    })

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
