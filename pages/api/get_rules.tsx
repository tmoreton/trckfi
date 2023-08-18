// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500)

  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    // @ts-ignore
    const rules = await prisma.rules.findMany({
      where: {
        OR: query,
      }
    })
  
    return res.status(200).json({ status: 'OK', data: rules })
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}