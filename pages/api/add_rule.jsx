// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import { snakeCase } from "snake-case";

export default async (req, res) => {
  const { ruleset, identifier, user_id, id } = req.body
  if (!ruleset) return res.status(500).json({ error: 'No Rule' })

  try {
    let rules = {}
    if (ruleset?.name) rules.custom_name = ruleset.name
    if (ruleset?.primary_category) rules.primary_category = snakeCase(ruleset.primary_category).toUpperCase()
    if (ruleset?.detailed_category) rules.detailed_category = snakeCase(ruleset.detailed_category).toUpperCase()
    if (ruleset?.unified) rules.unified = ruleset.unified
    // if (ruleset?.recurring) rules.recurring = (ruleset.recurring === 'true')
    if (ruleset?.active) rules.active = (ruleset.active === 'true')
    let data = { 
      user_id,
      identifier,
      ruleset: rules
    }
    let rule = {}
    if(id){
      rule = await prisma.rules.update({
        where: { 
          user_id,
          id
        },
        data
      })
    } else {
      rule = await prisma.rules.create({ data })
    }

    await prisma.transactions.updateMany({
      where: { 
        user_id,
        name: {
          contains: identifier
        }
      },
      data: rules,
    })
    return res.status(200).json({ status: 'OK', data: rule })
  } catch (error) {
    console.error(error)
    // throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}