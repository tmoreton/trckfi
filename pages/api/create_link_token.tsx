import prisma from '../../lib/prisma';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  console.log(req.headers.origin)
  const params = {
    user: {
      client_user_id: 'clj8r27ak0000mfh6gi3wqd6j',
    },
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    client_name: 'Trckfi',
    products: ['transactions'],
    language: 'en',
    country_codes: ['US'],
  };

  const createTokenResponse = await client.linkTokenCreate(params);
  return res.status(200).json(createTokenResponse.data);
}
