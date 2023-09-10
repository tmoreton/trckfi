// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { ruleset, identifier, user, id } = req.body
  if (!ruleset) return res.status(500).json({ error: 'No Rule' })

  try {
    let rules = {}
    if (ruleset?.custom_name || ruleset?.name) rules.custom_name = ruleset.custom_name || ruleset.name
    if (ruleset?.primary_category) rules.primary_category = snakeCase(ruleset.primary_category).toUpperCase()
    if (ruleset?.detailed_category) rules.detailed_category = snakeCase(ruleset.detailed_category).toUpperCase()
    if (ruleset?.unified) rules.unified = ruleset.unified
    // if (ruleset?.recurring) rules.recurring = (ruleset.recurring === 'true')
    if (ruleset?.active) rules.active = (ruleset.active === 'true')
    let data = { 
      user_id: user.id,
      identifier,
      ruleset: rules
    }
    let rule = {}
    const user_query = user.linked_user_id ? [{ user_id: user.id }, { user_id: user.linked_user_id }] : [{ user_id: user.id }]

    if(id){
      rule = await prisma.rules.update({
        where: { 
          OR: user_query,
          id: dd
        },
        data
      })
    } else {
      rule = await prisma.rules.create({ data })
    }

    await prisma.transactions.updateMany({
      where: {
        AND: [ 
          { OR: user_query }, 
          { OR: [{ name: { contains: identifier }}, { merchant_name: { contains: identifier }}] } 
        ],
      },
      data: rules,
    })

    await prisma.recurring.updateMany({
      where: { 
        AND: [ 
          { OR: user_query }, 
          { OR: [{ name: { contains: identifier }}, { merchant_name: { contains: identifier }}] } 
        ],
      },
      data: rules,
    })

    return res.status(200).json({ status: 'OK', data: rule })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_rule: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
    throw new Error(e)
  }
}