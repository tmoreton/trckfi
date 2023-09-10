// eslint-disable-next-line import/no-anonymous-default-export
import yahooFinance from 'yahoo-finance2';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { symbol } = req.body
  try {
    // @ts-ignore
    const { displayName, regularMarketPrice, currency, shortName, longName, typeDisp, fullExchangeName } = await yahooFinance.quote(symbol);
    let data = { displayName, regularMarketPrice, currency, shortName, symbol, longName, typeDisp, fullExchangeName }
    return res.status(200).json({ status: 'OK', data })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_stock_price: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}