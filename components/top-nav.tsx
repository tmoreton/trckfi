import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

export default function ({ currentRoute, title }) {
  const capitalizeFirstLetter = (title) => {
    let string = title?.replace(/[^a-zA-Z ]/g, "")?.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  return (
    <div className="static top-0 left-0 z-50 w-full h-16 bg-white border-b border-gray-200 block lg:hidden mb-5 pb-5">
      <div className="grid h-full max-w-lg grid-cols-6 mx-auto font-medium flex items-center">
        <div className="p-4">
          <Image
            src='/trckfi.png'
            alt='Trckfi'
            width={35}
            height={35}
          />
        </div>
        <p className="text-xl font-bold text-pink-600 pt-5 text-center mb-2 pb-2 col-span-4">{title && capitalizeFirstLetter(title)}</p>
        <Link href='/profile' className={currentRoute === '/profile' ? "block font-bold text-pink-600 text-center" : "block text-gray-900 text-center"}>
          <button type="button">
            <UserCircleIcon
              className='text-pink-600 text-gray-400 group-hover:text-pink-600 h-9 w-9 shrink-0 my-1'
              aria-hidden="true"
            />
          </button>
        </Link>
      </div>
    </div>
  )
}
