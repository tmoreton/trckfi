import { useSession } from "next-auth/react"
import Head from 'next/head'
import DashboardLayout from "../components/dashboard-layout"
import ChatPrompt from "../components/chat-prompt"
import { useEffect } from 'react'
import  { useLocalStorage } from '../utils/useLocalStorage'

export default function ({ showError }) {
  const { data: session } = useSession()
  const [initialInput, setPrompt] = useLocalStorage('initial_input', null)

  useEffect(() => {
    // if(session?.user && !initialInput) startPrompt()
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
    <DashboardLayout>
      <Head>
        <title>Trckfi - Chat</title>
      </Head>
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
  )
}