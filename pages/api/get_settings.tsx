// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user ) return res.status(500)

  try {
    const { linked_user_id } = user
    let linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
    
    return res.status(200).json({ status: 'OK', data: { linked_user }})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}