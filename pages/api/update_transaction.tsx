// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";

export default async (req, res) => {
  const { transaction, all } = JSON.parse(req.body)
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })

  try {
    if(all){
      const item = await prisma.transactions.findUnique({
        where: {
          id: transaction.id
        }
      })
      await prisma.transactions.updateMany({
        where: { name: item.name },
        data: { 
          name: transaction.name,
          primary_category: snakeCase(transaction.primary_category).toUpperCase(),
          detailed_category: snakeCase(transaction.detailed_category).toUpperCase(),
        }
      })
    } else {
      await prisma.transactions.update({
        where: { id: transaction.id },
        data: { 
          amount: Number(transaction.amount).toFixed(2),
          name: transaction.name,
          primary_category: snakeCase(transaction.primary_category).toUpperCase(),
          detailed_category: snakeCase(transaction.detailed_category).toUpperCase(),
        }
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}