// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user } = req.body
  const user_id = user?.id
  if (!user_id ) return res.status(500)
  const { id, linked_user_id } = user
  const user_query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
  
  try {
    const data = await prisma.netWorth.findMany({
      where:{
        OR: user_query,
      },
      orderBy: {
        created_at: 'desc'
      },
      select: {
        stats: true,
        snapshot: true,
        date: true,
        user_id: true,
        created_at: true
      }
    })
    
    let array = []
    if(linked_user_id){
      data.forEach(i => {
        let index = array.findIndex(e => e.date === i.date)
        if(index < 0){
          array.push(i)
        }  else {
          let snapshot = array[index].snapshot
          array[index].snapshot.auto = Number(snapshot.auto) + Number(i.snapshot?.auto)
          array[index].snapshot.cash = Number(snapshot.cash) + Number(i.snapshot?.cash)
          array[index].snapshot.other = Number(snapshot.other) + Number(i.snapshot?.other)
          array[index].snapshot.crypto = Number(snapshot.crypto) + Number(i.snapshot?.crypto)
          array[index].snapshot.stocks = Number(snapshot.stocks) + Number(i.snapshot?.stocks)
          array[index].snapshot.retirement = Number(snapshot.retirement) + Number(i.snapshot?.retirement)
          array[index].snapshot.real_estate = Number(snapshot.real_estate) + Number(i.snapshot?.real_estate)
          array[index].snapshot.auto = Number(snapshot.auto) + Number(i.snapshot?.auto)
          let stats = array[index].stats
          array[index].stats.assets = Number(stats.assets) + Number(i.stats?.assets)
          array[index].stats.net_worth = Number(stats.net_worth) + Number(i.stats?.net_worth)
          array[index].stats.liabilities = Number(stats.liabilities) + Number(i.stats?.liabilities)
        }
      })
    } else {
      array = data
    }
    let stats = array.length > 0 ? array[0] : {}
    let history = array.reverse()
    return res.status(200).json({ history, stats })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_net_worth: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}