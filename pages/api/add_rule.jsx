// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { ruleset, identifier, user_id } = req.body
  if (!ruleset) return res.status(500).json({ error: 'No Rule' })

  try {
    let data = { 
      user_id,
      identifier,
      ruleset
    }
    let rules = {}
    if (ruleset?.name) rules.name = ruleset.name
    if (ruleset?.primary_category) rules.primary_category = ruleset.primary_category
    if (ruleset?.detailed_category) rules.detailed_category = ruleset.detailed_category
    if (ruleset?.recurring) rules.recurring = (ruleset.recurring === 'true')
    if (ruleset?.active) rules.active = (ruleset.active === 'true')

    const rule = await prisma.rules.create({ data })
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
    return res.status(500).json({ error: error.message || error.toString() })
  }
}