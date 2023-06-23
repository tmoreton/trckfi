import prisma from '../../lib/prisma';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
// import {getSession} from 'next-auth/client'

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
  const publicToken = req.body.public_token;
  // const session = await getSession()
  // console.log(session.user.email)

  try {
    const response = await client.itemPublicTokenExchange({
      public_token: publicToken,
    });
    // These values should be saved to a persistent database and
    // associated with the currently signed-in user

    const user = await prisma.user.findUnique({
      where: {
        email: 'tmoreton89@gmail.com',
      },
    })

    if(user){
      const token = await prisma.plaid.create({
        data: {
          user_id: user.id,
          item_id: "response.data.item_id",
          access_token: "response.data.access_token"
        },
      })
    }

    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.log(error)
    // handle error
  }
}
