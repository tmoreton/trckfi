// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const { public_token, user_id } = req.body
  try {
    if(user_id){
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: public_token
      });

      await prisma.plaid.create({
        data: {
          user_id: user_id,
          item_id: response.data.item_id,
          access_token: response.data.access_token
        },
      })
      return res.status(200).json({ access_token: response.data.access_token })
    }

    return res.status(500).json('No User ID')
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}

