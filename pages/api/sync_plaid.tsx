// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import accountsSync from '../../utils/accountsSync'
import transactionsSync from '../../utils/transactionsSync'
import { client } from '../../trigger'

export default async (req, res) => {
  let { access_token } = req.body
  let { institution, item_id, user_id } = await prisma.plaid.findUnique({ where: { access_token: access_token }})
  await accountsSync(access_token, item_id, user_id, institution)
  // await transactionsSync(access_token, user_id)
  client.sendEvent({
    name: "sync.transactions",
    payload: { access_token, user_id },
  });
}
