// eslint-disable-next-line import/no-anonymous-default-export
import yahooFinance from 'yahoo-finance2';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user_id } = req.body

  if (!user_id) return res.status(500).json({ error: 'No User' })

  const stock_accounts = await prisma.accounts.findMany({
    where: {
      user_id: user_id,
      active: true,
      subtype: 'equity'
    },
  })
  if (stock_accounts.length <= 0) return res.status(200).json({ status: 'OK' })

  try {
    for (let i in stock_accounts) {
      // @ts-ignore
      const { regularMarketPrice } = await yahooFinance.quote(stock_accounts[i].details.symbol)
      await prisma.accounts.update({
        // @ts-ignore
        where: { id: stock_accounts[i].id },
        data: { 
          // @ts-ignore
          amount: Number(regularMarketPrice)*Number(stock_accounts[i].details.quantity)
        }
      })
      return res.status(200).json({ status: 'OK' })
    }
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}