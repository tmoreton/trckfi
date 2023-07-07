// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";

export default async (req, res) => {
  const transaction = JSON.parse(req.body).transaction
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  
  try {
    await prisma.transactions.update({
      where: {
        id: transaction.id
      },
      data: { 
        amount: Number(transaction.amount).toFixed(2),
        name: transaction.name,
        primary_category: snakeCase(transaction.primary_category).toUpperCase(),
        detailed_category: snakeCase(transaction.detailed_category).toUpperCase(),
      }
    })

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}