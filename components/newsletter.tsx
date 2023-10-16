import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import  { useLocalStorage } from '../utils/useLocalStorage'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useLocalStorage('subscribed', false)

  const subscribe = async (e) => {
    e.preventDefault()
    if(!subscribed){
      setSubscribed(true)
      setEmail('')
      await fetch(`/api/add_email`, {
        body: JSON.stringify({
          email,
          name
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    } else {
      alert("You're already on the waitlist!")
    }
  }

  return (
    <div className="relative isolate overflow-hidden bg-pink-600 p-10 shadow-2xl rounded-3xl sm:px-12 max-w-4xl mx-auto">
      { subscribed ? 
        <a id="get-notified">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Success! 🎉
          </h2>
          <p className="text-white mt-4 text-center">Check your email, we are ready for you to test the platform!</p>
          <ConfettiExplosion />
        </a>
        :
        <>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-6 text-center">
            Get Early Access <br/> <span className="font-normal">+ 3 Months Free</span>
          </h2>
          {/* <p className="text-white my-4">Sign up today, and gain early access when we launch Trckfi along with <b>3 months free</b>!</p> */}
          <form onSubmit={subscribe}>
            <div className="mx-auto flex max-w-md gap-x-4" >
              <input
                autoComplete="name"
                id="name"
                name="name"
                value={name}
                placeholder="Name"
                onChange={e => setName(e.target.value)}
                required
                type="name"
                disabled={subscribed}
                className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
              <input
                autoComplete="email"
                id="email"
                name="email"
                value={email}
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
                required
                type="email"
                disabled={subscribed}
                className="min-w-0 flex-auto rounded-3xl border-0 bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mx-auto flex max-w-md gap-x-4" >
            <button
              type="submit"
              className="flex-none w-full rounded-3xl mt-4 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:none focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Early Access
            </button>
            </div>
          </form>
        </>
      }
    </div>
  )
}

export default Newsletter