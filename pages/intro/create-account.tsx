import { useRouter } from 'next/router'
import { useState } from 'react';
import ProgressNav from '../../components/progress-nav'
import getStripe from '../../utils/get-stripejs'
import LoadingModal from '../../components/modals/loading-modal'

export default function CreateAccount({ showError }) {
  const router = useRouter()
  const { referral_id, price_id } = router.query
  const [email, setEmail] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRefreshing(true)
    fetch(`/api/add_email`, {
      body: JSON.stringify({
        email,
        type: 'create_account'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    checkout()
  }

  const checkout = async () => {
    const res = await fetch(`/api/checkout_session`, {
      body: JSON.stringify({ 
        price_id,
        referral_id,
        email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const data = await res.json()
    showError(data.error)
    if (data.error) return

    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      sessionId: data.id,
    })
    showError(error)
  }

  return (
    <>
      <ProgressNav width={'20%'} />
      <LoadingModal refreshing={refreshing} text='Creating Your Account...'/>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
        <div className="sm:mx-auto sm:w-full mb-4">
          <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
              Let's Create Your Account!
            </h1>
            <p className="text-md text-gray-600">
              No passwords to remember. Instead we will send you a magic link everytime you sign in.
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-small leading-6 text-pink-600 text-center">
                Email address
              </label>
              <div className="mt-2">
                <input          
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={e => setEmail(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                  />
              </div>
            </div>
            <button
              type="submit"
              className="flex text-center justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 mx-auto"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </>
  )
}