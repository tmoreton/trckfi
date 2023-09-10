// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user } = req.body

  try {
    await prisma.user.upsert({
      where: { id: user.linked_user_id },
      update: { 
        linked_user_id: null,
        active: false,
      },
      create: {},
    })

    await prisma.user.upsert({
      where: { id: user.id },
      update: { linked_user_id: null },
      create: {},
    })

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_link: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}
