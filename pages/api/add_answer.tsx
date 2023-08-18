// eslint-disable-next-line import/no-anonymous-default-export
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const { data } = req.body
  if (!data ) return res.status(500).json({ error: 'No answer provided' })
  try {
    // @ts-ignore
    await prisma.answers.create({ data })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error(error)
throw new Error(error)
    return res.status(500).json({ error: error.message || error.toString() })
  }
}