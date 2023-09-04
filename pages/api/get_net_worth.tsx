// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"
import netWorthSync from '../../utils/netWorthSync';
import { el } from 'date-fns/locale';

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
        // @ts-ignore
        date: true,
        user_id: true,
        created_at: true
      }
    })
    let array = []
    if(linked_user_id){
      data.forEach(i => {
         // @ts-ignore
        let index = array.findIndex(e => e.date == i.date)
        if(index < 0){
          array.push(i)
        }  else {
          array[index].stats = Object.assign(array[index].stats, i.stats)
          array[index].snapshot = Object.assign(array[index].snapshot, i.snapshot)
        }
      })
    } else {
      array = data
    }

    let stats = array.length > 0 ? array[0] : {}
    let history = array.reverse()

    return res.status(200).json({ history, stats })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}