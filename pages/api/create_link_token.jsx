// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const params = {
    user: { client_user_id: process.env.PLAID_CLIENT_ID },
    client_name: 'Trckfi',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
    webhook: 'https://trckfi.com/api/plaid_webhook',
    redirect_uri: 'https://trckfi.com/dashboard'
  };

  const createTokenResponse = await plaidClient.linkTokenCreate(params);
  return res.status(200).json(createTokenResponse.data);
}
