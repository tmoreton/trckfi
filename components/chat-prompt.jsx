import { useChat } from 'ai/react'

export default function () {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/open_ai',
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