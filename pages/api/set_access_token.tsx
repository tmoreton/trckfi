// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import plaidClient from '../../utils/plaid';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { public_token, user_id, metadata } = req.body

  // const response = await plaidClient.institutionsGetById({
  //   institution_id: metadata?.institution?.institution_id,
  //   // @ts-ignore
  //   country_codes: ['US'],
  // })

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
          // @ts-ignore
          institution: metadata?.institution?.name,
          institution_id: metadata?.institution?.institution_id
        },
      })
      return res.status(200).json({ access_token: data.access_token })
    }

    return res.status(500).json({ error: 'No User ID', access_token: null})
  } catch (e) {
    console.error(e)
    slackMessage('Error set_access_token: ' + e.message || e.toString())
    throw new Error(e)
  }
}

