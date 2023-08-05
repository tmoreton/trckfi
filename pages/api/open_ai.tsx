import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(config)

export default async (req, res) => {
  const { messages } = await req.json()
  const response = await openai.createChatCompletion({
    model: process.env.OPEN_AI_MODEL,
    stream: true,
    messages
  })

  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}