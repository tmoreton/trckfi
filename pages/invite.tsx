import { useState } from 'react'
import Container from '../components/container'
import Layout from '../components/layout'
import Head from 'next/head'
import Menu from '../components/menu'
import { getSession } from 'next-auth/react'

export default function ({ showError, user }) {
  const [email, setEmail] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if(user){
      const res = await fetch(`/api/send_link_token`, {
        body: JSON.stringify({
          user_id: user.id,
          from_email: user.email,
          to_email: email
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const { error } = await res.json()
      showError(error)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Trckfi - Invite User</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Invite User</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
            Here you can invite someone close to share your finances with
            </p>
        </div>
        <form onSubmit={send} method="POST" className="mx-auto max-w-xl">
            <div className="mt-10 relative z-0 w-full mb-6 group inline-flex">
            <div className="w-full">
                <input 
                type="email" 
                name="email" 
                id="email" 
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <label 
                htmlFor="email" 
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                Email
                </label>
            </div>
            </div>
            <button
            type="submit"
            className="block w-full rounded-md bg-pink-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
            Send Invite
            </button>
        </form>
        </div>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  const user = session?.user

  return {
    props: { user },
  }
}