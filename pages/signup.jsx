import { useState, useEffect } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Menu from '../components/menu'
import Meta from '../components/meta'
import { getCsrfToken } from "next-auth/react"

export default function ({ showError, csrfToken }) {
  const [updateEmail, setUpdateEmail] = useState('')
  return (
    <Layout>
      <Meta
        title="Sign Up"
        description="Sign up for Trckfi today!"
        image=''
        keywords=''
      />
      <Container>
        <Menu showError={showError}/>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome to Trckfi!</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 mb-4">
              Let's get started by creating an account!
            </p>
            <form className="space-y-6" method="post" action={`/api/auth/signin/email?callbackUrl=${process.env['NEXT_PUBLIC_BASE_URL']}/success`}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <div  className="mt-10 relative z-0 w-full mb-6 group inline-flex">
                <div className="w-full">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={updateEmail}
                    onChange={e => setUpdateEmail(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                  />
                  <label 
                    htmlFor="email" 
                    className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="flex mx-auto justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Create Account
              </button>
            </form>            
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)

  return { props: { csrfToken }}
}