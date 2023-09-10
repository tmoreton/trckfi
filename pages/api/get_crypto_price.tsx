import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
    const { id } = req.body
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      const { market_data, name, symbol, image } = await response.json()
      let data = {
        current_price: market_data?.current_price?.usd,
        symbol,
        name,
        image: image.large
      }
      return res.status(200).json({ status: 'OK', data })
    } catch (e) {
      console.error(e)
      slackMessage('Error get_crypto_price: ' + e.message || e.toString())
      return res.status(500).json({ error: e.message || e.toString() })
      throw new Error(e)
    }
  }