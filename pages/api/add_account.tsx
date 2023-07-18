// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { account, user_id } = req.body
  if (!account) return res.status(500).json({ error: 'No Account Info' })
  const { name, type, bank_name, amount } = account
  try {
    let data = { name, type, bank_name, amount, user_id }
    await prisma.accounts.create({ data })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}