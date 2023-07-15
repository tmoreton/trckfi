// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const { user_id } = req.body
  const params = {
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: 'Trckfi',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
    webhook: 'https://trckfi.com/api/plaid_webhook'
  }
  
  try {
    // @ts-ignore
    const { data } = await plaidClient.linkTokenCreate(params);
    return res.status(200).json({ link_token: data.link_token, user_id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
