import { useEffect, useState } from 'react';
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react"
import Icon from '../components/icon';
import { getSession } from 'next-auth/react'
import ConfettiExplosion from 'react-confetti-explosion'
import getStripe from '../utils/get-stripejs'
import LoadingModal from '../components/modals/loading-modal'
import Meta from '../components/meta'

export default function ({ csrfToken, user, showError, referral_id }) {
  const [checked, setChecked] = useState(true)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if(user?.email){
      checkout(user?.email)
    }
  }, [user?.email])

  const checkout = async (email) => {
    const res = await fetch(`/api/checkout_session`, {
      body: JSON.stringify({ 
        email,
        referral_id
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(checked){
      setSubmitted(true)
      const res = await fetch(`/api/auth/signin/email?callbackUrl=${process.env['NEXT_PUBLIC_BASE_URL']}/signup?referral_id=${referral_id}`, {
        body: JSON.stringify({ 
          email,
          csrfToken
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      await res.json()
      // showError(error)
    } else {
      showError('Please agree to terms.')
    }
  }

  if (!user?.email) return (
    <>
      <Meta
        title="Sign Up"
        description="Sign up for Trckfi today!"
        image=''
        keywords=''
      />
      {
        submitted ?
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
          <div className="sm:mx-auto sm:w-full mb-4">
            <Icon />
            <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
                Check Your Email
              </h1>
              <p className="text-md text-gray-600">
                A magic sign-in link has been sent to your email address.
              </p>
              <p className="text-xs text-gray-400">
                PS. Check your spam folder since it's your first email from us.
              </p>
              <p className="mt-6 text-base leading-7 text-gray-600">Having trouble logging in?</p>
              <div className="mt-1 flex items-center justify-center gap-x-6">
                <a href="mailto:support@trckfi.com" className="text-sm font-semibold text-gray-900">
                  Contact support <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
              <ConfettiExplosion />
            </div>
          </div>
        </div>
        :
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
          <div className="sm:mx-auto sm:w-full mb-4">
            <Icon />
            <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
                { referral_id && <span className="pb-10">Your friend gave you $10!<br/></span>} Let's create an account
              </h1>
              <p className="text-md text-gray-600">
                With passwordless login we don't use passwords that can be hacked. Instead we will send you a magic link everytime you sign in.
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <label htmlFor="email" className="block text-sm font-small leading-6 text-pink-600 text-center">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                />
              </div>
              {/* <fieldset>
                <legend className="sr-only">Terms of Service</legend>
                <div className="relative flex items-center justify-center py-2">
                  <div className="flex h-6 items-center">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      name="terms"
                      type="checkbox"
                      onChange={(e) => setChecked(e.target.checked)}
                      className="h-3 w-3 rounded border-gray-300 text-pink-600 focus:ring-pink-600"
                    />
                  </div>
                  <div className="ml-2 text-sm leading-6">
                    <span id="terms" className="text-gray-500">
                      I agree to Trckfi's
                    </span>
                    <label htmlFor="terms" className="ml-1 font-medium text-gray-900">
                      <a href="/terms-of-use" target="_blank">Terms of Service</a>
                    </label>
                  </div>
                </div>
              </fieldset> */}
              <button
                onClick={handleSubmit}
                className="flex text-center justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 mx-auto"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      }
    </>
  )
  return <LoadingModal refreshing={true} text="Checking Account Status..."/>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { referral_id } = context.query
  const session = await getSession(context)
  const user = session?.user
  // @ts-ignore
  if(user && user?.active) {
    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }
  
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken, user, referral_id },
  }
}