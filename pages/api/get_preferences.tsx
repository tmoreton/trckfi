// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500).json({ error: 'No User Info' })
  try {
    const preferences = await prisma.preferences.findUnique({
      // @ts-ignore
      where: { 
        user_id: user.id
      }
    })
    return res.status(200).json({ status: 'OK', data: preferences })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}