// eslint-disable-next-line import/no-anonymous-default-export
import { RiskCheckBehaviorUserInteractionsLabel } from 'plaid';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user } = req.body
  if (!user ) return res.status(500)

  try {
    const { linked_user_id } = user
    let linked_user = null
    if(linked_user_id){
      linked_user = await prisma.user.findUnique({
        where: { id: linked_user_id }
      })
    }
    
    const preferences = await prisma.preferences.findUnique({
      // @ts-ignore
      where: { 
        user_id: user.id
      }
    })

    // @ts-ignore
    const answers = await prisma.answers.groupBy({
      by: ['correct'],
      where: {
        user_id: user.id,
      },
      _count: {
        correct: true,
      },
    })
    let correct_answer = answers.find(a => a.correct === true)?._count?.correct
    let incorrect_answer = answers.find(a => a.correct === false)?._count?.correct
    let total = {
      correct: correct_answer || 0,
      total: correct_answer + incorrect_answer || 0
    }

    // @ts-ignore
    const referrals = await prisma.balances.aggregate({
      where: {
        user_id: user.id,
      },
      _count: {
        amount: true,
      },
      _sum: {
        amount: true,
      }
    })

    return res.status(200).json({ status: 'OK', data: { linked_user, preferences, referrals, answers: total }})
  } catch (error) {
    console.error(error)
    throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}