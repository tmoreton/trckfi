// eslint-disable-next-line import/no-anonymous-default-export
import slackMessage from '../../utils/slackMessage'

export default async (req, res) => {
  const { form, agreed } = req.body
  slackMessage(`New Creator Form \nName: ${form.first_name} ${form.last_name} \nCompany: ${form.company} \nEmail: ${form.email} \nMessage: ${form.message} \nIntersted in Beta? ${agreed}`)
}
