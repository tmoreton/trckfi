// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const transaction = JSON.parse(req.body).transaction
  if (!transaction) return res.status(500)
  
  try {
    await prisma.transactions.update({
      where: {
        id: transaction.id
      },
      data: { 
        user_id: null,
        transaction_id: null,
        active: false
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}