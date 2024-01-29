// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../lib/prisma';
const retirement_types = ['roth', 'roth 401k', 'ira', '401k', '401a', '403b', '457b', 'keogh', 'lif', 'lira', 'lrif', 'lrsp', 'prif', 'retirement', 'rrif', 'rrsp', 'sarsep', 'sep ira', 'simple ira', 'tfsa']
import { DateTime } from "luxon"
import slackMessage from '../utils/slackMessage'

const netWorthSync = async (user_id) => {
  try {
    let user = await prisma.user.findUnique({
      where: {
        id: user_id
      },
      include: {
        accounts: true
      }
    })
    console.log(user)
    let this_month = DateTime.now().toFormat('LLL yy')
    let data = {
      user_id,
      accounts: user?.accounts || [],
      date: this_month,
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

    if(user?.accounts && user.accounts.length > 0){
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
          if(a.subtype === 'brokerage' || a.subtype === 'etf' || a.subtype === 'equity' || a.subtype === 'fund'){
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
      const recent_net_worth = await prisma.netWorth.findFirst({
        where: {
          user_id,
          // @ts-ignore
          date: this_month
        }
      })
      if(recent_net_worth?.id){
        await prisma.netWorth.upsert({
          where: { id: recent_net_worth?.id },
          update: data,
          create: data,
        })
      } else {
        await prisma.netWorth.create({ data })
      }
    }
  } catch (error) {
    console.error(user_id)
    console.error(error)
    slackMessage(error.message || error.toString())
    throw new Error(error)
  }
}

export default netWorthSync