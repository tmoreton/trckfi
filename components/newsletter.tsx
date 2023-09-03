import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'

const Newsletter = ({ showError }) => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    const res = await fetch(`/api/create_user`, {
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
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-pink-600 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <a id="get-notified">Get notified when we launch.</a>
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
              className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              { subscribed ? "Success!  🎉" : "Join Waitlist"}
            </button>
            {subscribed && <ConfettiExplosion />}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Newsletter