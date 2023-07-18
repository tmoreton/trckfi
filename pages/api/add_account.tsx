// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import yahooFinance from 'yahoo-finance2';

export default async (req, res) => {
  const { account, user_id } = req.body
  if (!account) return res.status(500).json({ error: 'No Account Info' })
  const { name, subtype, institution, amount } = account
  try {
    if(subtype === 'stocks'){
      const test = await yahooFinance.quote(institution);
      console.log(test)
      const { regularMarketPrice, currency, shortName } = await yahooFinance.quote(institution);
      let data = { 
        name: shortName, 
        type: 'investment', 
        subtype, institution.toUpperCase(), 
        amount: regularMarketPrice * amount, 
        user_id, 
        details: { regularMarketPrice, currency, shortName, quantity: amount }
      }
      await prisma.accounts.create({ data })
    } else {
      let data = { name, subtype, institution, amount, user_id }
      await prisma.accounts.create({ data })
    }
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}