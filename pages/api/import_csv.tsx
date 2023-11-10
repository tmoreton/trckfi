// eslint-disable-next-line import/no-anonymous-default-export
import slackMessage from '../../utils/slackMessage'
import { client } from "../../trigger";

export default async (req, res) => {
  const { rows, user } = req.body
  if (!rows || !user) return res.status(500)

  try {
    await client.sendEvent({
      name: "import.csv",
      payload: { rows, user },
    })
    
    return res.status(200).json({ status: 'OK', complete: true })
  } catch (e) {
    console.error(e)
    slackMessage('Error import_csv: ' + e.message || e.toString())
    return res.status(500).json({ error: e.message || e.toString() })
  }
}