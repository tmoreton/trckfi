import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(config)

export default async (req, res) => {
  const { messages } = await req.json()
  console.log(messages)
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages
  })

  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}