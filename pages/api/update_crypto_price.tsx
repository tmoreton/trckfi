// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  let { user_id } = req.body

  if (!user_id) return res.status(500).json({ error: 'No User' })

  const crypto_accounts = await prisma.accounts.findMany({
    where: {
      user_id: user_id,
      active: true,
      subtype: 'crypto'
    },
  })
  try {
    for (let i in crypto_accounts) {
      // @ts-ignore
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto_accounts[i].details.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      const { market_data } = await response.json()
       // @ts-ignore
      let total = Number(market_data?.current_price?.usd)*Number(crypto_accounts[i].details.quantity)
      await prisma.accounts.update({
        // @ts-ignore
        where: { id: crypto_accounts[i].id },
        data: { 
          // @ts-ignore
          amount: Number(total)
        }
      })
      return res.status(200).json({ status: 'OK' })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}