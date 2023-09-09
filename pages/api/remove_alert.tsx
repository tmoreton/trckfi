// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { id } = req.body
  if (!id) return res.status(500)
  
  try {
    await prisma.transactions.update({
      where: {
        id
      },
      data: { 
        alert_date: null,
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
throw new Error(error)
  }
}