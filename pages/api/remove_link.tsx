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
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
throw new Error(error)
  }
}
