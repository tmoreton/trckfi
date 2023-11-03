import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { webhook_code, item_id } = req.body
  const data = { webhook_code, item_id }
  // const { access_token, user_id } = await prisma.plaid.findUnique({ where: { item_id }})
  try {
    await prisma.webhooks.create({ data })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    throw new Error(e)
  }
}
