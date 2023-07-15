import Footer from './footer'
import Meta from './meta'
import Container from './container'
import {
  BellIcon,
  CreditCardIcon,
  CubeIcon,
  FingerPrintIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import Menu from './menu'

const secondaryNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: UserCircleIcon, current: true },
  { name: 'Settings', href: '/settings', icon: FingerPrintIcon, current: false },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Plan', href: '#', icon: CubeIcon, current: false },
  { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
  { name: 'Team members', href: '#', icon: UsersIcon, current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Layout = ({ children, showError }) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        <Container>
        <div className="mx-auto lg:flex lg:gap-x-0">
          <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
            <nav className="flex-none px-4 sm:px-6 lg:px-0 lg:pr-8">
              <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-50 text-pink-600'
                          : 'text-gray-700 hover:text-pink-600 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.current ? 'text-pink-600' : 'text-gray-400 group-hover:text-pink-600',
                          'h-6 w-6 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <main className="px-4 py-10 sm:px-6 lg:flex-auto lg:px-0 lg:py-16">
            {children}
          </main>
        </div>
        </Container>
        
      </div>
      <Footer />
    </>
  )
}

export default Layout
