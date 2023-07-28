// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user ) return res.status(500)

  try {
    const { id, linked_user_id } = user
    let linked_user = null
    if(linked_user_id){
      linked_user = await prisma.user.findUnique({
        where: { id: linked_user_id }
      })
    }
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

    const a = await prisma.accounts.findMany({
      where: {
        OR: query,
        NOT: {
          account_id: null
        }
      },
      select: {
        name: true,
        institution: true,
        official_name: true,
        access_token: true,
        active: true,
        item_id: true
      },
    })

    const accounts = a.reduce(function (r, a) {
      r[a.item_id] = r[a.item_id] || [];
      r[a.item_id].push(a);
      return r;
    }, Object.create(null))
    
    return res.status(200).json({ status: 'OK', data: { linked_user, accounts }})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}