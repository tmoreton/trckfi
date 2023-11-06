import { getCsrfToken } from "next-auth/react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Icon from '../../components/icon';
import Link from 'next/link'
import  { clearLocalStorage } from '../../utils/useLocalStorage'
import CheckEmail from '../../components/check-email'

export default function SignIn({ csrfToken, showError }) {
  const [email, setEmail] = useState('')
  const [text, setText] = useState(null)
  const [active, setActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    clearLocalStorage()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/get_user`, {
      body: JSON.stringify({ 
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { text, active } = await res.json()
    setActive(active)

    if(active){
      setText(text)
      await fetch(`/api/auth/signin/email?callbackUrl=${process.env['NEXT_PUBLIC_BASE_URL']}/signin-success`, {
        body: JSON.stringify({ 
          email,
          csrfToken
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
    } else {
      router.push({
        pathname: '/intro/setup-account',
      })
    }
  }

  return (
    <>
      {
        text ?
        <CheckEmail email={email} text={text} active={active}/>
        :
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
          <div className="sm:mx-auto sm:w-full mb-4">
            <Icon />
            <div className="mx-auto pt-4 max-w-2xl text-center space-y-3">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
                Sign in to your account
              </h1>
              {/* <p className="text-md text-gray-600">
                With passwordless login we don't use passwords that can be hacked. Instead we will send you a magic link everytime you sign in.
              </p> */}
            </div>
          </div>
          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
                Sign in
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link href="/pricing" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">
                Get started
              </Link>
            </p>
          </div>
        </div>
      }
    </>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}