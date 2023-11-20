// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import { client } from "../../trigger";
import accountsSync from '../../utils/accountsSync';
import netWorthSync from '../../utils/netWorthSync';
import transactionsSync from '../../utils/transactionsSync';

export default async (req, res) => {
  let { access_token } = req.body
  let { institution, item_id, user_id } = await prisma.plaid.findUnique({ where: { access_token: access_token }})
  await accountsSync(access_token, item_id, user_id, institution)
  await netWorthSync(user_id)
  if(process.env['NEXT_PUBLIC_BASE_URL'].includes('demo')){
    await transactionsSync(access_token, user_id)
  }
  await client.sendEvent({
    name: "sync.plaid",
    payload: { access_token, item_id, user_id, institution },
  })
  return res.status(200).json({ status: "Ok" })
}
