// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { item, user } = req.body
  try {
    let data = { 
      user_id: user.id,
      identifier: item?.merchant_name || item?.name,
      ruleset: {
        recurring: false
      }
    }
    let rule = {}
    const user_query = user.linked_user_id ? [{ user_id: user.id }, { user_id: user.linked_user_id }] : [{ user_id: user.id }]

    const existing_rules = await prisma.rules.findMany({
      where: { 
        OR: user_query,
        identifier: data.identifier
      }
    })
    if(existing_rules.length <= 0){
      rule = await prisma.rules.create({ data })
    } else {
      rule = await prisma.rules.update({
        where: { 
          id: existing_rules[0].id,
        },
        data
      })
    }

    await prisma.transactions.update({
      where: { id: item?.id },
      data: {
        recurring: false,
        upcoming_date: null
      },
    })

    await prisma.transactions.updateMany({
      where: {
        AND: [ 
          { OR: user_query }, 
          { OR: [{ name: { contains: data.identifier }}, { merchant_name: { contains: data.identifier }}] } 
        ],
      },
      data: {
        recurring: false,
        upcoming_date: null
      },
    })

    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error removing_recurring: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}