// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { DateTime } from "luxon"

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500).json({ error: 'No User Info' })
  const endDate = DateTime.now().startOf('day')

  try {
     // @ts-ignore
    const a = await prisma.answers.findMany({
      where: { 
        user_id: user.id
      },
      take: 1,
      orderBy: {
        created_at: 'desc'
      }
    })

    if(a.length <= 0){
      // @ts-ignore
      let question = await prisma.questions.findUnique({
        where: { id: 1 }
      })
      return res.status(200).json({ status: 'OK', data: question })
    } else if(a[0]?.created_at > endDate) { 
      return res.status(200).json({ status: 'OK', data: null })
    } else {
      let num = Math.abs(Number(a[0].question_id))
      num++
      // @ts-ignore
      let question = await prisma.questions.findUnique({
        where: { id: num }
      })
      return res.status(200).json({ status: 'OK', data: question })
    }

  } catch (error) {
    console.error(error)
    throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}