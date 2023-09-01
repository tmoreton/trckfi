// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user_id, id } = req.body
  if (!id) return res.status(500)
  
  try {
    await prisma.accounts.delete({
      where: {
        user_id,
        id
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}