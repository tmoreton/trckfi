// eslint-disable-next-line import/no-anonymous-default-export
import yahooFinance from 'yahoo-finance2';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { search } = req.body
  try {
    const { quotes } = await yahooFinance.search(search)
    const data = quotes.filter(q => q.isYahooFinance)
    return res.status(200).json({ status: 'OK', data })
  } catch (error) {
    console.error(error)
slackMessage(error.message || error.toString())
throw new Error(error)
    // return res.status(500).json({ error: error.message || error.toString() })
  }
}