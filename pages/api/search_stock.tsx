// eslint-disable-next-line import/no-anonymous-default-export
import yahooFinance from 'yahoo-finance2';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { search } = req.body
  try {
    const { quotes } = await yahooFinance.search(search)
    const data = quotes.filter(q => q.isYahooFinance)
    return res.status(200).json({ status: 'OK', data })
  } catch (e) {
    console.error(e)
    slackMessage('Error search_stock: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}