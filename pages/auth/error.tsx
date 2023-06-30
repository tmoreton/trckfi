import Icon from '../../components/icon';

export default function () {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <Icon />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Unable to sign in</h1>
        <p className="mt-6 text-base text-gray-600">The sign in link is no longer valid.</p>
        <p className="fontmt-0 text-base text-gray-600 text-[12px] ">It may have been used already or it may have expired.</p>
        <div className="mt-4 flex items-center justify-center gap-x-6">
          <a href="/api/auth/signin">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Sign in
            </button>
          </a>
        </div>
      </div>
    </main>
  )
}
