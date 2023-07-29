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
    } catch (error) {
      console.error(error)
      // return res.status(500).json({ error: error.message || error.toString() })
    }
  }