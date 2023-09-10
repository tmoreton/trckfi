// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { transaction, ids } = req.body
  if (!transaction) return res.status(500)
  
  try {
    if(ids.length > 0){
      ids.forEach( async (i) => {
        await prisma.transactions.update({
          where: {
            id: i
          },
          data: { 
            active: false
          }
        })
      })
    } else {
      await prisma.transactions.update({
        where: {
          id: transaction.id
        },
        data: { 
          active: false
        }
      })
    }
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_transaction: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}