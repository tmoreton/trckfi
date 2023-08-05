import { useChat } from 'ai/react'

export default function ({ initialInput }) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/open_ai',
    initialInput: initialInput,
    initialMessages: [ { role: 'user', content: initialInput } ]
  })

  return (
    <div className="flex flex-col justify-between" style={{height: '100vh'}}>
      <ul role="list" className="space-y-6">
        {messages?.length > 1 && messages.map((m) => (
          <li key={m.id} className="relative flex gap-x-2">
            {
              !m.content.includes('You are a seasoned financial planner') &&
              <>
                <div className="w-px bg-gray-200" />
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  <div className="h-4 w-4 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-900">{m.role}</span> {m.content}
                </p>
                {/* <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
                  {activityItem.date}
                </time> */}             
              </>
            }
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-x-3">
        <form onSubmit={handleSubmit} className="relative flex-auto">
          <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-0">
            <textarea
              rows={2}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent p-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none ring-gray-300"
              placeholder="Examples: What will my net worth be in 30 years? How much can I save over the next 3-6 months? etc.."
              defaultValue={''}
              onChange={handleInputChange}
              value={input}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <button
              type="submit"
              className="items-center inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto"
            >
              Ask
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

