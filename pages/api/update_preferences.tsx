// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user, payload } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Payload Info' })
  try {
    await prisma.preferences.update({
      // @ts-ignore
      where: { 
        user_id: user.id
      },
      data: { 
        vision_board: payload
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}