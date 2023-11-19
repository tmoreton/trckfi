import prisma from '../../lib/prisma';
import { client } from "../../trigger";

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  const data = { webhook_code, item_id }
  try {
    await prisma.webhooks.create({ data })
    switch (webhook_code) {
      case 'SYNC_UPDATES_AVAILABLE':
        const { access_token, user_id, institution } = await prisma.plaid.findUnique({
          where: { item_id, active: true }
        })
        if(access_token){
          await client.sendEvent({
            name: "sync.plaid",
            payload: { access_token, item_id, user_id, institution }
          })
        }
        break;
      case 'NEW_ACCOUNTS_AVAILABLE':
        await prisma.plaid.update({
          where: { item_id, active: true },
          data: { error_code: 'NEW_ACCOUNTS_AVAILABLE' }
        })
        break;
      default:
        break
    }    
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
