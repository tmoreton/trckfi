import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'

const Newsletter = ({ showError }) => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    const res = await fetch(`/api/add_email`, {
      body: JSON.stringify({
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  return (
      <div className="relative isolate overflow-hidden bg-pink-600 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
        { subscribed ? 
        <a id="get-notified">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Success! 🎉
          </h2>
          <p className="text-white mt-4">We are hard at work and will reach our with an <br/>access code when the platform is ready!</p>
          <ConfettiExplosion />
        </a>
        :
        <>
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <a id="get-notified">Get Early Access!</a>
          </h2>
          <form className="mx-auto mt-10 flex max-w-md gap-x-4" onSubmit={subscribe}>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              value={email}
              placeholder={'Enter your email'}
              onChange={e => setEmail(e.target.value)}
              required
              type="email"
              disabled={subscribed}
              className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:none focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Join Waitlist
            </button>
            
          </form>
        </>
      }
    </div>
  )
}

export default Newsletter