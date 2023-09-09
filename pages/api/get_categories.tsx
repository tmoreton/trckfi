// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { user } = req.body
  if (!user ) return res.status(500)

  try {
    const { id, linked_user_id } = user
    const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]
    
    const primary_categories = await prisma.transactions.groupBy({
      by: ['primary_category'],
      where: {
        OR: query,
        active: true,
      },
      orderBy: {
        primary_category: 'asc'
      },
    })

    const detailed_categories = await prisma.transactions.groupBy({
      by: ['detailed_category'],
      where: {
        OR: query,
        active: true,
      },
      orderBy: {
        detailed_category: 'asc'
      },
    })
  
    return res.status(200).json({ status: 'OK', data: { primary_categories, detailed_categories }})
  } catch (error) {
    console.error(error)
    slackMessage(error.message || error.toString())
throw new Error(error)
  }
}