// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { user_id, account } = req.body
  if (!user_id || !account) return res.status(500).json({ error: 'No User or Account Info' })
  try {
    await prisma.accounts.update({
      where: { id: account.id },
      data: { 
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        institution: account.institution,
        amount: account.amount
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}