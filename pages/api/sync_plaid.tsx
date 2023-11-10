// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import accountsSync from '../../utils/accountsSync'
import transactionsSync from '../../utils/transactionsSync'
// import recurringSync from '../../utils/recurringSync'
import netWorthSync from '../../utils/netWorthSync'
import { client } from "../../trigger";

export default async (req, res) => {
  let { access_token } = req.body
  let { institution, item_id, user_id } = await prisma.plaid.findUnique({ where: { access_token: access_token }})
  await accountsSync(access_token, item_id, user_id, institution)
  await netWorthSync(user_id)
  transactionsSync(access_token, user_id)
  console.log('Syncing recurring')
  await client.sendEvent({
    name: "check.recurring",
    payload: {},
  })
  // recurringSync(access_token)
  return res.status(200).json({ status: "Ok" })
}
