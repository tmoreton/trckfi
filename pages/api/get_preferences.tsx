// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user } = req.body
  if (!user) return res.status(500).json({ error: 'No User Info' })
  try {
    let preferences = {}
    if(!user.subscription_id){
      preferences = await prisma.preferences.findUnique({
        // @ts-ignore
        where: { 
          user_id: user.linked_user_id
        }
      })
    } else {
      preferences = await prisma.preferences.findUnique({
        // @ts-ignore
        where: { 
          user_id: user.id
        }
      })
    }
    return res.status(200).json({ status: 'OK', data: preferences })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_preferences: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}