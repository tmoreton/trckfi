import { useState, useEffect } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Menu from '../components/menu-dashboard'
import { getSession } from 'next-auth/react'
import { getCsrfToken } from "next-auth/react"
import prisma from '../lib/prisma'

export default function ({ showError, access_code, csrfToken, error, email }) {
  const [updateEmail, setUpdateEmail] = useState('')

  useEffect(() => {
    setUpdateEmail(email)
  }, [email])

  useEffect(() => {
    if(error) showError(error)
  }, [error])

  return (
    <Layout>
      <Container>
        <Menu showError={showError} title="Link User"/>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome to Trckfi!</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 mb-4">
              Let's get started by creating an account!
            </p>
            <form className="space-y-6" method="post" action={`/api/auth/signin/email?callbackUrl=${process.env['NEXT_PUBLIC_BASE_URL']}/link-user?access_code=${access_code}`}>
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
        {/* { user &&
          <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Link Accounts!</h2>
              <p className="mt-2 text-lg leading-8 text-gray-600 mb-4">
                Let's link accounts with your access code below:
              </p>
              <form onSubmit={handleSubmit} method="POST" className="mx-auto max-w-xl">
                <div className="mt-10 relative z-0 w-full mb-6 group inline-flex">
                  <div className="w-full">
                    <input 
                      type="text" 
                      name="access_code" 
                      id="access_code" 
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                      required
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value)}
                    />
                    <label 
                      htmlFor="access_code" 
                      className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Access Code
                    </label>
                  </div>
                </div>
                <PinkBtn type="button" onClick={handleSubmit}>
                  Link Account
                </PinkBtn>
              </form>
            </div>
          </div>
        } */}
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  const { access_code, email } = context.query
  const session = await getSession(context)
  const user = session?.user

  if(user && access_code) {
    const link_token = await prisma.linkTokens.findUnique({ 
      where: { 
        access_code,
        to_email: user.email
      }
    })
    
    if(!link_token) return { props: { csrfToken, access_code, error: 'Invalid Access Code' } }
    if (new Date() > link_token?.expires) return { props: { csrfToken, access_code, error: 'Access Code has expired' } }

    const subscribed_user = await prisma.user.upsert({
      where: { id: link_token.user_id },
      update: {
        // @ts-ignore
        linked_user_id: user.id 
      },
      create: {},
    })
    
    await prisma.user.upsert({
      // @ts-ignore
      where: { id: user.id },
      update: { 
        linked_user_id: subscribed_user.id,
        active: true,
        login_count: {
          increment: 1,
        },
      },
      create: {},
    })

    return {
      redirect: {
        destination: '/visionboard',
        permanent: false,
      },
    }
  }

  return {
    props: { csrfToken, email, access_code },
  }
}