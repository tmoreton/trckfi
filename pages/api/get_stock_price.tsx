// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import yahooFinance from 'yahoo-finance2';

export default async (req, res) => {
  const { stock, search } = req.body
  try {
    if(search){
      const { quotes } = await yahooFinance.search(search)
      const data = quotes.filter(q => q.isYahooFinance)
      return res.status(200).json({ status: 'OK', data })
    } else {
      // @ts-ignore
      const { regularMarketPrice, currency, shortName } = await yahooFinance.quote(stock);
      let data = { regularMarketPrice, currency, shortName }
      return res.status(200).json({ status: 'OK', data })
    }   
  } catch (error) {
    console.error(error)
    // return res.status(500).json({ error: error.message || error.toString() })
  }
}