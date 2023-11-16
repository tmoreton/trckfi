import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function ({ currentRoute }) {
  return (
    <div className="static top-0 left-0 z-50 w-full h-16 bg-white border-b border-gray-200 block lg:hidden mb-5 pb-5">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium flex items-center">
          <div></div>
          <p className="text-lg font-bold text-pink-600 pt-5 text-center mb-2 pb-2 col-span-4">{currentRoute?.replace(/[^a-zA-Z ]/g, "")?.toUpperCase()}</p>
          <Link href='/profile' className={currentRoute === '/profile' ? "block font-bold text-pink-600 text-right" : "block text-gray-900 text-right"}>
            <button type="button">
              <UserCircleIcon
                className='text-pink-600 text-gray-400 group-hover:text-pink-600 h-8 w-8 shrink-0 my-1'
                aria-hidden="true"
              />
            </button>
          </Link>
      </div>
    </div>
  )
}
