// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import transactionsSync from '../../utils/transactionsSync';
import accountsSync from '../../utils/accountsSync';

export default async (req, res) => {
  let { access_token } = req.body
  try {
    let { user_id, institution, item_id } = await prisma.plaid.findUnique({ where: { access_token: access_token }})
    let accounts = await accountsSync(access_token, item_id, user_id, institution)
    transactionsSync(access_token, '', accounts, user_id)
    return res.status(200).json({ status: 'OK', data: accounts})
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
