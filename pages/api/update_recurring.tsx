// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user, item } = req.body
  if (!user || !item) return res.status(500).json({ error: 'No User or Payload Info' })
  try {
    const upcoming = (item) => {
      if(item){
        switch (item.frequency) {
          case 'ANNUALLY':
            return DateTime.fromISO(item.last_date).plus({ years: 1 }).toFormat('yyyy-MM-dd')
          case 'MONTHLY':
            return DateTime.fromISO(item.last_date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
          case 'SEMI_MONTHLY':
            return DateTime.fromISO(item.last_date).plus({ months: 2 }).toFormat('yyyy-MM-dd')
          case 'BIWEEKLY':
            return DateTime.fromISO(item.last_date).plus({ weeks: 2 }).toFormat('yyyy-MM-dd')
          case 'WEEKLY':
            return DateTime.fromISO(item.last_date).plus({ weeks: 1 }).toFormat('yyyy-MM-dd')
          case 'UNKNOWN':
            return DateTime.fromISO(item.last_date).plus({ months: 1 }).toFormat('yyyy-MM-dd')
          default:
            break;
        }  
      }
    }

    await prisma.recurring.update({
      where: { 
        stream_id: item.stream_id
      },
      data: {
        // @ts-ignore
        custom_name: item.custom_name,
        frequency: item.frequency,
        is_active: (item.is_active === 'true'),
        upcoming_date: upcoming(item)
      }
    })
    
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}