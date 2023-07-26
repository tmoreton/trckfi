// eslint-disable-next-line import/no-anonymous-default-export

export default async (req, res) => {
  const { search } = req.body
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${search}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
    const { coins } = await response.json()
    return res.status(200).json({ status: 'OK', data: coins })
  } catch (error) {
    console.error(error)
    // return res.status(500).json({ error: error.message || error.toString() })
  }
}