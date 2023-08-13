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
    const accounts = await prisma.accounts.groupBy({
      by: ['type', 'subtype'],
      where: {
        OR: user_query,
        active: true,
      },
      _sum: {
        amount: true,
      },
    })

    let data = {
      user_id,
      accounts,
      stats: {
        net_worth: 0,
        assets: 0,
        liabilities: 0,
      },
      snapshot: {
        cash: 0,
        stocks: 0,
        crypto: 0,
        real_estate: 0,
        retirement: 0,
        auto: 0,
        other: 0
      }
    }

    accounts.forEach(a => {
      if (a.type === 'loan' || a.type === 'credit'){
        data.stats.liabilities += Number(a._sum.amount)
      } else {
        data.stats.assets += Number(a._sum.amount)
      }
      
      if (a.type === 'depository' || a.type === 'credit'){
        data.snapshot.cash += Math.round(Number(a._sum.amount))
      }

      // Compare real estate value minus mortgage
      if (a.subtype === 'mortgage' || a.subtype === 'real_estate' || a.subtype === 'real estate'){
        data.snapshot.real_estate += Math.round(Number(a._sum.amount))
      }

      //Account for all investments
      if (a.type === 'investment'){
        if(a.subtype === 'brokerage' || a.subtype === 'etf' || a.subtype === 'equity'){
          data.snapshot.stocks += Math.round(Number(a._sum.amount))
        } else if (a.subtype === 'ira' || a.subtype === '401k'){
          data.snapshot.retirement += Math.round(Number(a._sum.amount))
        } else if (a.subtype === 'crypto'){
          data.snapshot.crypto += Math.round(Number(a._sum.amount))
        } else if (a.subtype !== 'real_estate' && a.subtype !== 'real estate') {
          data.snapshot.other += Math.round(Number(a._sum.amount))
        }
      }
    })
    data.stats.net_worth = data.stats.assets - (-data.stats.liabilities)

    // @ts-ignore
    const netWorthHistory = await prisma.netWorth.findMany({
      where:{
        OR: user_query,
      },
      orderBy: {
        created_at: 'asc'
      },
      select: {
        snapshot: true,
        created_at: true,
        updated_at: true
      }
    })

    if(netWorthHistory.length <= 0 || DateTime.now(netWorthHistory[0].created_at).toISO() < DateTime.now().minus({ months: 1 }).toISO()){
      // @ts-ignore
      await prisma.netWorth.create({ data })
    }
    return res.status(200).json({ data: data, netWorthHistory: netWorthHistory })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}