// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import netWorthSync from '../../utils/netWorthSync'

export default async (req, res) => {
  const { user_id, id } = req.body

  try {
    await prisma.accounts.update({
      where: { 
        user_id, 
        id 
      },
      data: { 
        active: false
      },
    })
    
    await prisma.transactions.updateMany({
      where: { 
        user_id, 
        account_id: id 
      },
      data: { 
        active: false
      },
    })

    // @ts-ignore
    // await prisma.recurring.updateMany({
    //   where: { 
    //     user_id, 
    //     account_id: id 
    //   },
    //   data: { 
    //     is_active: false
    //   },
    // })
    await netWorthSync(user_id)
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}