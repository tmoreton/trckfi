// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user, account } = req.body
  if (!account) return res.status(500).json({ error: 'No User or Account Info' })
  try {
    await prisma.accounts.update({
      where: { 
        user_id: user.id,
        id: account.id
      },
      data: { 
        active: true
      }
    })
    await prisma.transactions.updateMany({
      where: { 
        user_id: user.id,
        item_id: account.item_id
      },
      data: { 
        active: true
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}