// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { rule } = req.body
  if (!rule?.id) return res.status(500)
  
  try {
    if(rule?.custom_name){
      await prisma.transactions.updateMany({
        where: { 
          custom_name: rule?.custom_name
        },
        data: { 
          custom_name: null
        },
      })
    }

    await prisma.rules.delete({
      where: { id: rule?.id }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (e) {
    console.error(e)
    slackMessage('Error remove_rule: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}