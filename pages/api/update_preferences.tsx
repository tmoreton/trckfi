// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default async (req, res) => {
  const { user, preferences } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Payload Info' })
  try {
    if(!user.subscription_id){
      await prisma.preferences.update({
        where: { 
          user_id: user.linked_user_id
        },
        data: preferences
      })
    } else {
      await prisma.preferences.update({
        where: { 
          user_id: user.id
        },
        data: preferences
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
    return res.status(500).json({ error: error.message || error.toString() })
  }
}