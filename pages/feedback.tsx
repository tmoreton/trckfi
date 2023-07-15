import { useSession } from "next-auth/react"
import { useState } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'
import Menu from '../components/menu'

export default function ({ showError }) {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if(session.user){
      const res = await fetch(`/api/send_email`, {
        body: JSON.stringify({
          email: session.user.email,
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
  }

  return (
    <Layout>
      <Head>
        <title>Trckfi - Feedback</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Feedback</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We are constantly trying to Trckfi so we would love to hear from you!
            </p>
          </div>
          <form onSubmit={send} method="POST" className="mx-auto max-w-xl">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-pink-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </Container>
    </Layout>
  )
}