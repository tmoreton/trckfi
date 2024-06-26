// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

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
    let correct_answer = answers.find(a => a.correct === true)?._count?.correct || 0
    let incorrect_answer = answers.find(a => a.correct === false)?._count?.correct || 0
    let total = {
      correct: correct_answer || 0,
      total: correct_answer + incorrect_answer || 0
    }

    // @ts-ignore
    const referrals = await prisma.balances.groupBy({
      by: ['type'],
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

    return res.status(200).json({ status: 'OK', data: { linked_user, referrals, answers: total }})
  } catch (e) {
    console.error(e)
    slackMessage('Error get_settings: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}