import Icon from '../../components/icon';
import Head from 'next/head'

export default function () {
  return (
    <>
      <Head>
        <title>Trckfi - Verify</title>
      </Head> 
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Icon />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Check Your Email</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">A magic sign-in link has been sent to your email address.</p>
          <p className="text-xs text-gray-400">
            PS. Check your spam folder since it's your first email from us.
          </p>
          <p className="mt-6 text-base leading-7 text-gray-600">Having trouble logging in?</p>
          <div className="mt-2 flex items-center justify-center gap-x-6">
            <a href="mailto:support@trckfi.com" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
