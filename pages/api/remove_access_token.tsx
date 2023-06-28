// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { access_token } = req.body
  try {
    const response = await plaidClient.itemRemove({
      access_token: access_token
    });
    if(response.data){
      await prisma.plaid.delete({
        where: {
          access_token: access_token,
        },
      })
      await prisma.accounts.updateMany({
        where: {
          access_token: access_token
        },
        data: {
          active: false
        }
      })
    }
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
