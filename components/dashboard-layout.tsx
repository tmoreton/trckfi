import Footer from './footer'
import Meta from './meta'
import Container from './container'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"
import { clearLocalStorage } from "../utils/useLocalStorage"
import Image from 'next/image'
import Logo from '../assets/trckfi-black.jpg'

const secondaryNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: UserCircleIcon },
  { name: 'Net Worth', href: '/net-worth', icon: ChartBarIcon },
  // { name: 'Custom Rules', href: '/rules', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Feedback', href: '/feedback', icon: UserCircleIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ children }) {
  const router = useRouter()
  const currentRoute = router.pathname
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Container>
          <div className="mx-auto lg:flex lg:gap-x-0">
            <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-12">
              <nav className="flex-none px-4 sm:px-6 lg:px-0 lg:pr-8">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                  <Link href='/' className="flex">
                    <div className="pb-4 flex justify-center items-center">
                      <Image
                        src='/trckfi-black.png'
                        alt='Trckfi'
                        width={250}
                        height={100}
                      />
                    </div>
                  </Link>
                  {/* <Link href='/' className="flex">
                    <div className="pb-4 flex justify-center items-center">
                      <svg className="h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="75" height="75" ><path fill="#db2777" d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7H256c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96h32l-18.8 75.1c15.8 14.8 28.7 32.8 37.5 52.9H544c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H512c-9.1 12.1-19.9 22.9-32 32v64c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H256v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V416c-34.9-26.2-58.7-66.3-63.2-112H68c-37.6 0-68-30.4-68-68s30.4-68 68-68h4c13.3 0 24 10.7 24 24s-10.7 24-24 24H68c-11 0-20 9-20 20s9 20 20 20H99.2c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2H384zm64 136c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z"/></svg>
                      <h1 className="ml-3 text-3xl font-semibold font-semibold leading-6 text-gray-900">Trckfi</h1>
                      <p className="text-xs font-bold text-white rounded-3xl bg-pink-600 p-1">beta</p>
                    </div>
                  </Link> */}
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          currentRoute === item.href
                            ? 'bg-gray-50 text-pink-600'
                            : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            currentRoute === item.href ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => {
                        clearLocalStorage()
                        signOut()
                      }}
                      className='w-full text-gray-700 hover:text-pink-600 hover:bg-gray-50 group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                    >
                      <UsersIcon className='text-gray-400 group-hover:text-pink-600 h-6 w-6 shrink-0' aria-hidden="true" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
            <main className="px-4 py-10 sm:px-6 lg:flex-auto lg:px-0 lg:py-12">
              {children}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  )
}