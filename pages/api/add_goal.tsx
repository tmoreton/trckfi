// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { goal, user } = req.body
  if (!goal) return res.status(500).json({ error: 'No goal provided' })
  try {
    if(goal.id){
      let data = goal
      data.date = new Date(goal.date)
      // @ts-ignore
      await prisma.goals.update({
        where: { 
          id: goal.id
        },
        data
      })
    } else {
      let data = goal
      data.date = new Date(goal.date)
      // @ts-ignore
      data.user_id = user.id
      // @ts-ignore
      await prisma.goals.create({ data })
    }
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_goal ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}