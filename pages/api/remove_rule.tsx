// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { id } = req.body
  if (!id) return res.status(500)
  try {
    // @ts-ignore
    await prisma.rules.delete({
      where: { id }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}