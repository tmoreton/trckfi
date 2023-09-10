// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { access_code, user } = req.body

  try {
    const link_token = await prisma.linkTokens.findUnique({
      where: { 
        access_code: access_code, 
        to_email: user.email 
      }
    })

    if(!link_token) return res.status(200).json({ error: 'Access Code not found' })
    if (new Date() > link_token?.expires) return res.status(200).json({ error: 'Access Code has expired, please try again' })
   
    const subscribed_user = await prisma.user.upsert({
      where: { id: link_token.user_id },
      update: { 
        linked_user_id: user.id 
      },
      create: {},
    })

    await prisma.user.upsert({
      where: { id: user.id },
      update: { 
        linked_user_id: subscribed_user.id,
        active: true,
      },
      create: {},
    })

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error link_account: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}
