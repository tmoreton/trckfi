// eslint-disable-next-line import/no-anonymous-default-export
import plaidClient from '../../utils/plaid';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { access_token } = req.body
  try {

    const response = await plaidClient.itemRemove({
      access_token: access_token
    })
    console.log(response)
    if(response.data){
      await prisma.plaid.updateMany({
        where: {
          access_token: access_token
        },
        data: {
          active: false
        }
      })
      await prisma.accounts.updateMany({
        where: {
          access_token: access_token
        },
        data: {
          active: false
        }
      })
      // await prisma.transactions.updateMany({
      //   where: {
      //     item_id: 
      //   },
      //   data: {
      //     active: false
      //   }
      // })
    }
    return res.status(200).json('ok');
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() })
  }
}
