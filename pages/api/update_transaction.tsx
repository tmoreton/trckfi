// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";

export default async (req, res) => {
  const { transaction, ids } = JSON.parse(req.body)
  if (!transaction) return res.status(500).json({ error: 'No Transaction' })
  const { id, name, unified, primary_category, detailed_category, amount, notes } = transaction
  try {
    if(ids.length > 0){
      ids.forEach( async (i) => {
        const item = await prisma.transactions.findUnique({
          where: { id: i }
        })
        let data = {}
        if (name) data['name'] = name
        if (notes) data['notes'] = notes
        if (unified && unified !== '1f50d') data['unified'] = unified
        if (primary_category) data['primary_category'] = snakeCase(primary_category).toUpperCase()
        if (detailed_category) data['detailed_category'] = snakeCase(detailed_category).toUpperCase()
        await prisma.transactions.updateMany({
          where: { name: item.name },
          data
        })
      })
    } else {
      await prisma.transactions.update({
        where: { id },
        data: { 
          amount: Number(amount).toFixed(2),
          primary_category: snakeCase(primary_category).toUpperCase(),
          detailed_category: snakeCase(detailed_category).toUpperCase(),
          name,
          unified,
          notes
        }
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}