// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"

export default async (req, res) => {
  const { user } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const { id, linked_user_id } = user
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
  
  try {
    const data = await prisma.netWorth.findMany({
      // where:{
      //   OR: user_query,
      // },
      where:{
        user_id,
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    let stats = data[0]
    let history = data.reverse()

    return res.status(200).json({ history, stats })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}