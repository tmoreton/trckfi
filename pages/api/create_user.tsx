// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { validateEmail } from '../../lib/lodash'

export default async (req, res) => {
  const { email, subscribed } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }
  let isValid = validateEmail(email)
  console.log(isValid)
  try {
    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { email: email.toLowerCase(), subscribed },
      create: { email: email.toLowerCase(), subscribed },
    })
    
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
