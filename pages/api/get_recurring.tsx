// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body

  if (!user) return res.status(500).json({ error: 'No user token' })
  
  const { id, linked_user_id } = user
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  try {
    // @ts-ignore
    const recurring = await prisma.recurring.findMany({
      where: {
        OR: user_query,
        is_active: true
      },
      include: {
        account: true,
      },
      orderBy: [
        {
          upcoming_date: 'asc',
        },
      ],
    })

    // @ts-ignore
    const inactive = await prisma.recurring.findMany({
      where: {
        OR: user_query,
        is_active: false
      },
      include: {
        account: true,
      },
      orderBy: [
        {
          upcoming_date: 'asc',
        },
      ],
    })

    return res.status(200).json({ status: 'ok', recurring, inactive })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}