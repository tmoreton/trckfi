import { useState, useEffect } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'
import Menu from '../components/menu'
import { getSession } from 'next-auth/react'
import PinkBtn from '../components/pink-btn'
import { useRouter } from 'next/router'

export default function ({ showError, user, access_code }) {
  const [accessCode, setAccessCode] = useState('')
  const router = useRouter()

  useEffect(() => {
    if(access_code){
      setAccessCode(access_code)
    }
  }, [access_code])

  useEffect(() => {
    link()
  }, [])

  const link = async () => {
    if(user && accessCode){
      const res = await fetch(`/api/link_accounts`, {
        body: JSON.stringify({
          user: user,
          access_code: accessCode
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const { error } = await res.json()
      showError(error)
      if(!error) router.replace('/dashboard?new_user=true', undefined, { shallow: true });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    link()
  }

  return (
    <Layout>
      <Head>
        <title>Trckfi - Link Account</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        {/* { !user && access_code &&
          <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Welcome to Trckfi!</h2>
              <p className="mt-2 text-lg leading-8 text-gray-600 mb-4">
                Let's get started by creating an account!
              </p>
              <LoginBtn />
            </div>
          </div>
        } */}
        { user &&
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
                <PinkBtn onClick={handleSubmit}>
                  Link Account
                </PinkBtn>
              </form>
            </div>
          </div>
        }
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { access_code } = context.query
  const session = await getSession(context)
  const user = session?.user

  if(!user && !access_code) return {
    redirect: {
      destination: '/auth/email-signin',
      permanent: false,
    },
  }

  return {
    props: { user: session?.user, access_code },
  }
}