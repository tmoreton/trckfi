// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { access_token } = req.body
  const params = {
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: 'Trckfi',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
    webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid_webhook`
  }

  if(access_token) params['access_token'] = access_token
  try {
    // @ts-ignore
    const { data } = await plaidClient.linkTokenCreate(params);
    return res.status(200).json({ link_token: data.link_token })
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
    throw new Error(error)
  }
}
