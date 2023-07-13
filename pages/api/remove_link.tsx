// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'

export default async (req, res) => {
  const { user } = req.body

  try {
    await prisma.user.upsert({
      where: { id: user.linkedUserId },
      update: { 
        linkedUserId: null,
        active: false,
      },
      create: {},
    })

    await prisma.user.upsert({
      where: { id: user.id },
      update: { linkedUserId: null },
      create: {},
    })

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
