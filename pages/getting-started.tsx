import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken } from "next-auth/react"
import Icon from '../components/icon';
import CheckoutBtn from '../components/checkout-btn'
import { useSession } from "next-auth/react"

export default function ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session } = useSession()

  if (session && !session?.user?.stripeSubscriptionId) return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full mb-4">
        <Icon />
        <div className="pt-4 text-center space-y-3">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
            Success! 🎉
          </h1>
          <p className="text-lg text-gray-600 w-1/3 mx-auto">
            We successfully created an account for you, next let's get access to our personalization dashboard
          </p>
        </div>
      </div>
      <div className="my-4 mx-auto">
        <CheckoutBtn />
      </div>
      <p className="text-xs text-gray-400 text-center">
        Cancel anytime for any reason
      </p>
    </div>
  )
  
  if (!session) return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-20 lg:px-8">
      <div className="sm:mx-auto sm:w-full mb-4">
        <Icon />
        <div className="pt-4 text-center space-y-3">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight md:leading-none mb-4">
            Let's Get Started!
          </h1>
          <p className="text-lg text-gray-600">
            First let's create an account for you. <br/> We use email magic links so no passwords to forget!
          </p>
          <p className="text-xs text-gray-400">
            PS. Check your spam folder since it's your first email from us.
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
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}