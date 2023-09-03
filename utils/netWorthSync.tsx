// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
const retirement_types = ['roth', 'roth 401k', 'ira', '401k', '401a', '403b', '457b', 'keogh', 'lif', 'lira', 'lrif', 'lrsp', 'prif', 'retirement', 'rrif', 'rrsp', 'sarsep', 'sep ira', 'simple ira', 'tfsa']
import { DateTime } from "luxon"

const netWorthSync = async (user_id) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        id: user_id,
        active: true,
      },
      include: {
        accounts: true
      }
    })
    let today = DateTime.now().toFormat('MM-dd-yyyy')
    let data = {
      user_id: user.id,
      accounts: user.accounts,
      date: today,
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

    if(user.accounts && user.accounts.length > 0){
      user.accounts.forEach(a => {
        if (a.type === 'loan' || a.type === 'credit'){
          data.stats.liabilities += Number(a.amount)
        } else {
          data.stats.assets += Number(a.amount)
        }
        
        if (a.type === 'depository'){
          data.snapshot.cash += Math.round(Number(a.amount))
        }

        // Compare real estate value minus mortgage
        if (a.subtype === 'mortgage' || a.subtype === 'real_estate' || a.subtype === 'real estate'){
          data.snapshot.real_estate += Math.round(Number(a.amount))
        }

        //Account for all investments
        if (a.type === 'investment'){
          if(a.subtype === 'brokerage' || a.subtype === 'etf' || a.subtype === 'equity'){
            data.snapshot.stocks += Math.round(Number(a.amount))
          } else if (retirement_types.includes(a.subtype)){
            data.snapshot.retirement += Math.round(Number(a.amount))
          } else if (a.subtype === 'crypto'){
            data.snapshot.crypto += Math.round(Number(a.amount))
          } else if (a.subtype !== 'real_estate' && a.subtype !== 'real estate') {
            data.snapshot.other += Math.round(Number(a.amount))
          }
        }
      })
      data.stats.net_worth = Math.round(Number(data.stats.assets - (-data.stats.liabilities)))
      const recent_net_worth = await prisma.netWorth.findMany({
        where: {
          user_id,
          // @ts-ignore
          date: today
        }
      })
      if(recent_net_worth.length > 0){
        await prisma.netWorth.update({
          where: {
            id: recent_net_worth[0].id
          },
          data
        })
      } else {
        await prisma.netWorth.create({data})
      }
    }
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export default netWorthSync