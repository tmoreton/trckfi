import Link from 'next/link'

export default function () {
  return (
    <div className="overflow-hidden bg-pink-600 px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h4 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Sign up for Trckfi today!
        </h4>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white">
          Start reaching your financial goals with powerful tools, personalized insights, and much more.
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Link href="/pricing" className="mt-5 rounded-3xl px-5 py-2.5 text-2xl font-semibold text-pink-600 hover:shadow-md bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
            Start Trial <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
