import Link from 'next/link'
import Image from 'next/image'
import { social_icons } from '../components/social-icons'

export default function Links() {
  return (
    <div className="flex h-screen bg-pink-600">
      <div className="w-full flex items-center mx-auto justify-center p-5">
        <div className="space-y-5">
          <Image
            src="/trckfi-white.png"
            alt="Trckfi"
            className="text-center mx-auto my-4 sm:mb-10"
            width={250}
            height={250}
            unoptimized={true}
          />
          <Link href="/">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 sm:py-4 text-xl sm:text-3xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full my-2 sm:my-3"
            > 
              Join our Waitlist!
            </button>
          </Link>
          <Link href="/blog">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 sm:py-4 text-xl sm:text-3xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full my-2 sm:my-3"
            >
              Check Our Blog & Boost Your Financial Literacy
            </button>
          </Link>
          <Link href="/blog/monthly-financial-checkin-routine-for-success">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 sm:py-4 text-xl sm:text-3xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full my-2 sm:my-3"
            >
              Monthly Financial Routine
            </button>
          </Link>
          <Link href="/blog/how-to-achieve-financial-organization">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 sm:py-4 text-xl sm:text-3xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full my-2 sm:my-3"
            >
              Financial Organization
            </button>
          </Link>
          <Link href="/blog/tracking-monthly-expenses">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 sm:py-4 text-xl sm:text-3xl font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 w-full my-2 sm:my-3"
            >
              Tracking Monthly Expenses
            </button>
          </Link>
          <div className="flex space-x-6 justify-center pb-4">
            {social_icons.map((item) => (
              <a key={item.name} href={item.href} className="text-white hover:text-gray-200">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-10 w-10" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}