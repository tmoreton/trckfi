// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user) return res.status(500)

  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    const accounts = await prisma.accounts.findMany({
      where: {
        OR: query,
      },
      include: {
        plaid: true
      },
      orderBy: {
        amount: 'desc'
      },
    })

    return res.status(200).json({ status: 'OK', data: accounts})
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}