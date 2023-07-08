import React, { useEffect } from 'react';
import type { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react"
import Icon from '../components/icon';
import { getSession } from 'next-auth/react'
import Menu from '../components/menu'
import Container from "../components/container"
import Layout from "../components/layout"
import Head from 'next/head'
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
    <Layout>
      <Head>
        <title>Trckfi - Getting Started</title>
      </Head>
      <Container>
        <Menu showError={showError} />
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
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full min-w-0 flex-auto rounded-md bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 border border-gray-300"
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </Container>
    </Layout>
  )
  return <LoadingModal refreshing={true} text="Checking Account Status..."/>

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  // if(session && session?.user) return {
  //   redirect: {
  //     destination: '/dashboard',
  //     permanent: false,
  //   },
  // }

  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken, user: session?.user },
  }
}