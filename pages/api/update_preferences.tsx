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

const updateOrCreate = async (data, user_id) => {
  console.log(user_id)
  console.log(data)
  if(data?.id){
    return await prisma.preferences.update({
      where: { 
        user_id
      },
      data
    })
  } else {
    await prisma.preferences.upsert({
      where: { user_id },
      update: {},
      create: data,
    })
  }
}

export default async (req, res) => {
  const { user, preferences } = req.body
  if (!user) return res.status(500).json({ error: 'No User or Payload Info' })
  let data = {}
  try {
    if(!user.subscription_id){
      data = updateOrCreate(preferences, user.linked_user_id)
    } else {
      data = updateOrCreate(preferences, user.id)
    }

    return res.status(200).json({ status: 'OK', data })
  } catch (e) {
    console.error(e)
    slackMessage('Error update_preferences: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}