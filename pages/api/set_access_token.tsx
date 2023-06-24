// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  const { public_token, metadata } = req.body
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: public_token
    });

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
