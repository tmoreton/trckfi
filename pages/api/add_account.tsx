// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import netWorthSync from '../../utils/netWorthSync'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const data = req.body
  if (!data ) return res.status(500).json({ error: 'No Account Info' })
  try {
    await prisma.accounts.create({ data })
    await netWorthSync(data.user_id)
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
    throw new Error(error)
  }
}