// eslint-disable-next-line import/no-anonymous-default-export
import { WebClient } from '@slack/web-api'
const web = new WebClient(process.env.SLACK_TOKEN);

const slackMessage = async (message) => {
  try {
    await web.chat.postMessage({ channel: "#website", text: message });
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export default slackMessage