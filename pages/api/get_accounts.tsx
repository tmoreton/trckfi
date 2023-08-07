// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { addComma } from '../../lib/lodash'

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
    const a = await prisma.accounts.findMany({
      where: {
        OR: query,
      },
      include: {
        plaid: true
      },
      orderBy: {
        // @ts-ignore
        amount: 'asc'
      },
    })

    const accounts = a.reduce(function (r, a) {
      r[a.institution] = r[a.institution] || [];
      r[a.institution].push(a);
      return r;
    }, Object.create(null))

    let total_assets = 0
    let total_liabilities = 0
    a.forEach(a => {
      if(a.type === 'loan' || a.type === 'credit'){
        // @ts-ignore
        total_liabilities -= Number(a.amount)
      } else {
        // @ts-ignore
        total_assets += Number(a.amount)
      }
    })
  
    const net_worth_stats = [
      { name: 'Net Worth', value: addComma(total_assets-total_liabilities), change: '', changeType: 'nuetral' },
      { name: 'Assets', value: addComma(total_assets), change: '', changeType: 'positive' },
      { name: 'Liabilities', value: addComma(total_liabilities), change: '', changeType: 'negative' },
    ]

    return res.status(200).json({ status: 'OK', data: { accounts, net_worth_stats }})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}