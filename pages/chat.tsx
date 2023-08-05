import { useSession } from "next-auth/react"
import Head from 'next/head'
import DashboardLayout from "../components/dashboard-layout"
import ChatPrompt from "../components/chat-prompt"
import { useState, useEffect } from 'react'

export default function ({ showError }) {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [initialInput, setPrompt] = useState('')

  useEffect(() => {
    if(session?.user) startPrompt()
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

  const send = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/open_ai`, {
      body: JSON.stringify({
        user: session.user,
        message
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setMessage('Successfully sent!')
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Chat</title>
      </Head>
      <ChatPrompt initialInput={initialInput}/>
    </DashboardLayout>
  )
}