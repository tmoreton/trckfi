import { useChat } from 'ai/react'

export default function ({ initialInput }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/open_ai',
    initialInput: initialInput,
    initialMessages: [ { role: 'user', content: initialInput } ]
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <label>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder='Your prompt'
          />
        </label>

        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

