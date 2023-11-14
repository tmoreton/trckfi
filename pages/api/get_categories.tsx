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
        pending: false,
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
        pending: false,
      },
      orderBy: {
        detailed_category: 'asc'
      },
    })

    const tags = await prisma.transactions.groupBy({
      by: ['tags'],
      where: {
        OR: query,
        active: true,
        pending: false,
      },
      orderBy: {
        tags: 'asc'
      },
    })

    let uniq_tags = []
    tags.forEach((t) => {
      if(t?.tags){
        const iterator = Object.values(t.tags)
        for (const tag of iterator) {
          !uniq_tags.includes(tag) && uniq_tags.push(tag)
        }
      }
    })

    return res.status(200).json({ status: 'OK', data: { primary_categories, detailed_categories, tags: uniq_tags }})
  } catch (e) {
    console.error(e)
    slackMessage('Error get_categories: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}