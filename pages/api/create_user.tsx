// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  try {
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { email: email.toLowerCase() },
      create: { email: email.toLowerCase() },
    })

    await prisma.preferences.upsert({
      // @ts-ignore
      where: { user_id: user.id },
      update: { email_newsletter: true, user_id: user.id },
      create: { email_newsletter: true, user_id: user.id },
    })
    
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
