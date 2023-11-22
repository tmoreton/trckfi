// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import netWorthSync from '../../utils/netWorthSync'
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { user_id, id } = req.body

  try {
    await prisma.accounts.update({
      where: { 
        user_id, 
        id 
      },
      data: { 
        active: false
      },
    })
    
    await prisma.transactions.updateMany({
      where: { 
        user_id, 
        account_id: id 
      },
      data: { 
        active: false
      },
    })

    await netWorthSync(user_id)
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error hide_account: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}