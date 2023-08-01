// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500)

  try {
    const { id, linked_user_id } = user

    let linked_user = null
    if(linked_user_id){
      linked_user = await prisma.user.findUnique({
        where: { id: linked_user_id }
      })
    }
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    const alerts = await prisma.transactions.findMany({
      where: {
        OR: query,
        active: true,
        alert_date: {
          not: null
        }
      },
      orderBy: {
        alert_date: 'desc'
      },
    })
  
    return res.status(200).json({ status: 'OK', data: alerts})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}