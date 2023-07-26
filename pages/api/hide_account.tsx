// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user_id, id } = req.body

  try {
    const account = await prisma.accounts.upsert({
      where: { user_id, id },
      update: { active: false },
      create: {},
    })

    await prisma.transactions.updateMany({
      where: { 
        user_id, 
        account_id: account.account_id 
      },
      data: { 
        active: false
      },
    })

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}