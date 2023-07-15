// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';

export default async (req, res) => {
  let body;
  if(typeof req.body === 'object'){
    body = req.body
  } else {
    body = JSON.parse(req.body)
  }
  let { public_token, user_id, metadata } = body

  try {
    if(user_id){
      const { data } = await plaidClient.itemPublicTokenExchange({
        public_token: public_token
      })

      await prisma.plaid.create({
        data: {
          user_id: user_id,
          item_id: data.item_id,
          access_token: data.access_token,
          bank_name: metadata?.institution?.name,
          link_session_id: metadata?.link_session_id,
          public_token: metadata?.public_token
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

