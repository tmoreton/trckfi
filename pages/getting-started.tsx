import React, { useEffect } from 'react';
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react"
import Icon from '../components/icon';
import { getSession } from 'next-auth/react'
import getStripe from '../utils/get-stripejs'
import LoadingModal from '../components/loading-modal'

export default function ({ csrfToken, user, showError }) {
  const email = user?.email

  const handleSubmit = async (email) => {
    const res = await fetch(`/api/checkout_session`, {
      body: JSON.stringify({ 
        email: email
      }),
      method: 'POST',
    })
    const data = await res.json()
    showError(data.error)
    if (data.error) return

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      sessionId: data.id,
    })
    showError(error)
  }

  useEffect(() => {
    if(email){
      handleSubmit(email)
    }
  }, [email])

  if (!email) return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full mb-4">
        <Icon />
        <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
            Let's create an account
          </h1>
          <p className="text-md text-gray-600">
            With passwordless login we don't use passwords that can be hacked. Instead we will send you a magic link everytime you sign in.
          </p>
        </div>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-3" method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label htmlFor="email" className="block text-sm font-small leading-6 text-pink-600">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
              />
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
  )
  return <LoadingModal refreshing={true} text="Checking Account Status..."/>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  if(session) return {
    redirect: {
      destination: '/dashboard',
      permanent: false,
    },
  }

  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken, user: session },
  }
}