import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"
import Icon from '../../components/icon';
import Link from 'next/link'

export default function SignIn({ csrfToken, base_url }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Icon />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" method="post" action={`/api/auth/signin/email?callbackUrl=${base_url}/success`}>
        {/* <form className="space-y-6" method="post" action={`/api/auth/signin/email`}> */}
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
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
          </div>
          <button
            type="submit"
            className="flex text-center justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 mx-auto"
          >
            Sign in
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <Link href="/getting-started" className="font-semibold leading-6 text-pink-600 hover:text-pink-500">
            Get started
          </Link>
        </p>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  const base_url = process.env.BASE_URL
  return {
    props: { csrfToken, base_url },
  }
}