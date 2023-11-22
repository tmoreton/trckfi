// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { ruleset, identifier, user, id } = req.body
  if (!ruleset) return res.status(500).json({ error: 'No Rule' })
  const user_id = user.id
  try {
    let rules = {}
    if (ruleset?.custom_name || ruleset?.name) rules.custom_name = ruleset.custom_name || ruleset.name
    if (ruleset?.primary_category) rules.primary_category = snakeCase(ruleset.primary_category).toUpperCase()
    if (ruleset?.detailed_category) rules.detailed_category = snakeCase(ruleset.detailed_category).toUpperCase()
    if (ruleset?.unified) rules.unified = ruleset.unified

    let data = { 
      user_id,
      identifier,
      ruleset: rules
    }
    let rule = {}
    const user_query = user.linked_user_id ? [{ user_id: user.id }, { user_id: user.linked_user_id }] : [{ user_id: user.id }]

    if(id){
      rule = await prisma.rules.update({
        where: { 
          OR: user_query,
          id
        },
        data
      })
    } else {
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
    }

    await prisma.transactions.updateMany({
      where: {
        AND: [ 
          { OR: user_query }, 
          { OR: [{ 
              name: { 
                contains: identifier,
                mode: 'insensitive'
              }
            }, { 
              merchant_name: { 
                contains: identifier,
                mode: 'insensitive'
              }
            }] 
          } 
        ],
      },
      data: rules,
    })

    return res.status(200).json({ status: 'OK', data: rule })
  } catch (e) {
    console.error(e)
    slackMessage('Error add_rule: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}