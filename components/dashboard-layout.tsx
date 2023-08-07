import Footer from './footer'
import Meta from './meta'
import Container from './container'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleLeftEllipsisIcon,
  CloudIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"
import Image from 'next/image'
import  { clearLocalStorage } from '../utils/useLocalStorage'

const secondaryNavigation = [
  { name: 'Visionboard', href: '/visionboard', icon: CloudIcon },
  { name: 'Dashboard', href: '/dashboard', icon: UserCircleIcon },
  { name: 'Accounts', href: '/accounts', icon: ChartBarIcon },
  // { name: 'Ask AI', href: '/chat', icon: ChatBubbleLeftEllipsisIcon },
  { name: 'Custom Rules', href: '/rules', icon: AdjustmentsHorizontalIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Feedback', href: '/feedback', icon: ChatBubbleOvalLeftEllipsisIcon },
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
            <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-6">
              <nav className="flex-none px-4 sm:px-6 lg:px-0 lg:pr-8">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                  <Link href='/' className="flex">
                    <div className="pb-4 flex justify-center items-center">
                      <Image
                        src='/trckfi-logo-beta.png'
                        alt='Trckfi'
                        width={200}
                        height={100}
                      />
                    </div>
                  </Link>
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
                        signOut()
                        clearLocalStorage()
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
            <main className="px-4 py-10 sm:px-6 lg:flex-auto lg:px-0 lg:py-6">
              {children}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  )
}