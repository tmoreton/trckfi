// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const { public_token, user_id } = req.body
  try {
    if(user_id){
      const { data } = await plaidClient.itemPublicTokenExchange({
        public_token: public_token
      });

      await prisma.plaid.create({
        data: {
          user_id: user_id,
          item_id: data.item_id,
          access_token: data.access_token
        },
      })
      return res.status(200).json({ access_token: data.access_token })
    }

    return res.status(500).json({ error: 'No User ID', access_token: null})
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}

