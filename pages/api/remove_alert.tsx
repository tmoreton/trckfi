// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

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
    return res.status(500).json({ error: error.message || error.toString() })
  }
}