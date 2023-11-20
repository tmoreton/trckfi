import { useState } from 'react'
import { useSession } from "next-auth/react"
import ConfettiExplosion from 'react-confetti-explosion'
import ProgressNav from '../../components/progress-nav'
import { PinkBtn } from '../../components/pink-btn'
import Link from 'next/link'

export default function ({ showError }) {
  const [success, showSuccess] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const [email, setEmail] = useState('')

  const send = async (e) => {
    e.preventDefault()
    // setSendBtn('Email Sent! 🎉')
    const res = await fetch(`/api/send_link_token`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user?.id,
        from_email: user?.email,
        to_email: email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    showSuccess(true)
  }


  return (
    <>
      <ProgressNav width={'90%'} />
      <div className="relative isolate flex min-h-full flex-1 flex-col justify-center py-20">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            { success ?
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Successfully sent invite!
                </h1>
                <p className="mt-5 mb-10 text-2xl text-gray-600">
                  Once your linked user logs in they can see the same dashboard as you!
                </p>
                <Link href="/visionboard" className="mt-7 rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Go to Dashboard
                </Link>
                <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>
              </div>
              :
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Want to add someone to your account?
                </h1>
                <form onSubmit={send} method="POST">
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="Email"
                    className="w-full lg:w-1/2 mt-20 text-2xl mx-auto text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />        
                  <div className="my-8">
                    <PinkBtn onClick={send} type="submit">
                      Send Invite
                    </PinkBtn>
                  </div>         
                </form>
                <Link href="/dashboard" className="text-center mx-auto text-pink-600 hover:text-pink-500">
                  No thanks, maybe later
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}