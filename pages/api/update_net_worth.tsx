// eslint-disable-next-line import/no-anonymous-default-export
import netWorthSync from '../../utils/netWorthSync'

export default async (req, res) => {
  const { user_id } = req.body
  if (!user_id) return res.status(500).json({ error: 'No User or Account Info' })
  try {
    await netWorthSync(user_id)
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}