// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  let { email } = req.body
  if (!email) return res.status(500)

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if(user && user.active) return res.status(200).json({ status: 'OK', text: 'Check your email!', active: true, user })
    if(user && !user.active) return res.status(200).json({ status: 'OK', text: 'Account is currently inactive', active: false, user })
    if(!user) {
      await prisma.emails.upsert({
        where: { email: email.toLowerCase() },
        update: { email: email.toLowerCase() },
        create: { email: email.toLowerCase() },
      })
    }

    return res.status(200).json({ status: 'OK', user })
  } catch (e) {
    console.error(e)
    slackMessage('Error get_user: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}