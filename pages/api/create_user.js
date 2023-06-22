import prisma from '../../lib/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email Is Required' })
  }

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: { email: email.toLowerCase() },
  })
  
  return res.status(200).json({ status: 'OK' })
}
