import Link from 'next/link'
import {
  ChartBarIcon,
  HomeIcon,
  SparklesIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/solid'
import { classNames } from '../lib/lodash'

const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions/mobile', icon: CreditCardIcon },
  { name: 'Accounts', href: '/accounts', icon: ChartBarIcon },
  { name: 'Recurring', href: '/recurring', icon: ArrowPathIcon },
  { name: 'Goals', href: '/goals', icon: SparklesIcon },
  // { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftEllipsisIcon },
]

export default function ({ currentRoute }) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-white border-t border-gray-200 block lg:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {
          dashboardNavigation.map((item) => (
            <Link href={item.href} key={item.name}  className={currentRoute === item.href ? "block font-bold text-pink-600 px-3 py-2 text-center" : "block text-gray-900 px-3 py-2 text-center"}>
              <button type="button" className="inline-flex flex-col items-center justify-center group">
                <item.icon
                  className={classNames(
                    currentRoute === item.href ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-600',
                    'h-7 w-7 shrink-0 my-1'
                  )}
                  aria-hidden="true"
                />
                <span className={classNames(
                    currentRoute === item.href ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-600',
                    'text-[8px] text-gray-500'
                  )}>{item.name}</span>
              </button>
            </Link>
          ))
        }
      </div>
    </div>
  )
}
