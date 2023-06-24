// eslint-disable-next-line import/no-anonymous-default-export
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

export default async (req, res) => {
  const { publicToken, metadata } = req.body
  console.log(metadata)
  try {
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken
    });
    // accounts: metadata.accounts,
    // institution: metadata.institution,
    // linkSessionId: metadata.linkSessionId,
    const user = await prisma.user.findUnique({
      where: {
        email: 'tmoreton89@gmail.com',
      },
    })

    if(user){
      const token = await prisma.plaid.create({
        data: {
          user_id: user.id,
          item_id: response.data.item_id,
          access_token: response.data.access_token
        },
      })
    }

    return res.status(200).json({ access_token: response.data.access_token })
  } catch (error) {
    console.log(error)
    // handle error
  }
}
