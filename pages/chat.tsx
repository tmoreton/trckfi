import { useSession } from "next-auth/react"
import DashboardLayout from "../components/dashboard-layout"
import ChatPrompt from "../components/chat-prompt"
import { useEffect, useState } from 'react'
import Menu from '../components/menu'
import Meta from '../components/meta'

export default function ({ showError }) {
  const { data: session } = useSession()
  const [initialInput, setPrompt] = useState(null)

  useEffect(() => {
    // if(session?.user && initialInput.length > 1) startPrompt()
    startPrompt()
  }, [])

  const startPrompt = async () => {
    const res = await fetch(`/api/get_ai_prompt`, {
      body: JSON.stringify({
        user: session?.user,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    setPrompt(data)
    showError(error)
  }

  // const getAiAccounts = async () => {
  //   const res = await fetch(`/api/get_ai_accounts`, {
  //     body: JSON.stringify({
  //       user: session?.user,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //   })
  //   const { error, data } = await res.json()
  //   setPrompt(data)
  //   showError(error)
  // }

  return (
    <>
    <Meta
      title="AI Chat"
      description="Ask AI about your finances"
      image=''
      keywords=''
    />
    <Menu showError={showError}/>
    <DashboardLayout>
      {/* {
        !initialInput &&
        <div className="lg:flex justify-center space-x-6 mb-4 sm:block">
          <button onClick={startPrompt} className="inline-flex items-center rounded-full bg-pink-50 p-3 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
            Use my transactions data from the last 3 months to ask a question
          </button>
          <button onClick={getAiAccounts} className="inline-flex items-center rounded-full bg-pink-50 p-3 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
            Use my current net worth to ask a question
          </button>
        </div>
      } */}
      <ChatPrompt initialInput={initialInput}/>
    </DashboardLayout>
  </>
  )
}