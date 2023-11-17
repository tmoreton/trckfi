import Container from './container'
import {
  ChartBarIcon,
  UserCircleIcon,
  HomeIcon,
  SparklesIcon,
  ChatBubbleLeftEllipsisIcon,
  CloudIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import BottomNav from './bottom-nav'
import TopNav from './top-nav'

const secondaryNavigation = [
  { name: 'Visionboard', href: '/visionboard', icon: CloudIcon },
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Net Worth & Accounts', href: '/accounts', icon: ChartBarIcon },
  { name: 'Recurring Charges', href: '/recurring', icon: ArrowPathIcon },
  { name: 'Goals', href: '/goals', icon: SparklesIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftEllipsisIcon },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ children }) {
  const router = useRouter()
  const currentRoute = router.pathname
  return (
      <Container>
        <TopNav currentRoute={currentRoute}/>
        <div className="mx-auto lg:flex lg:gap-x-0">
          <aside className="hidden lg:flex overflow-x-auto border-b border-gray-900/5 lg:block lg:flex-none lg:border-0">
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
              </ul>
            </nav>
          </aside>
          <main className="lg:flex-auto z-10 pb-20">
            {children}
          </main>
        </div>
        <BottomNav currentRoute={currentRoute} />
      </Container>    
  )
}