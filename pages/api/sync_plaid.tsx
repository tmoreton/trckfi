// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma'
import { client } from "../../trigger";

export default async (req, res) => {
  let { access_token } = req.body
  let { institution, item_id, user_id } = await prisma.plaid.findUnique({ where: { access_token: access_token }})
  await client.sendEvent({
    name: "sync.plaid",
    payload: { access_token, item_id, user_id, institution },

  })
  return res.status(200).json({ status: "Ok" })
}
