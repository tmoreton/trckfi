import Footer from './footer'
import Container from './container'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftEllipsisIcon,
  CloudIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from "next-auth/react"
import  { clearLocalStorage } from '../utils/useLocalStorage'

const secondaryNavigation = [
  { name: 'Visionboard', href: '/visionboard', icon: CloudIcon },
  { name: 'Dashboard', href: '/dashboard', icon: UserCircleIcon },
  { name: 'Accounts', href: '/accounts', icon: ChartBarIcon },
  // { name: 'Rules & Reminders', href: '/rules', icon: AdjustmentsHorizontalIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ children }) {
  const router = useRouter()
  const currentRoute = router.pathname
  return (
    <>
      <div className="min-h-screen">
        <Container>
          <div className="mx-auto lg:flex lg:gap-x-0">
            <aside className="hidden lg:flex overflow-x-auto border-b border-gray-900/5 lg:block lg:w-64 lg:flex-none lg:border-0">
              <nav className="flex-none px-4 sm:px-6 lg:px-0 lg:pr-8">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
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
            <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
              {children}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  )
}