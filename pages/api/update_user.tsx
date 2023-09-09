// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user, preferences } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Account Info' })
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: preferences
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}