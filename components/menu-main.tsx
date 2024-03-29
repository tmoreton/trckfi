import { Fragment } from 'react'
import { Bars3Icon, XMarkIcon  } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LoginBtn from './login-btn'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import  { clearLocalStorage } from '../utils/useLocalStorage'
import {
  ChartBarIcon,
  UserCircleIcon,
  HomeIcon,
  SparklesIcon,
  CloudIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
  // { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
]

const features = [
  { name: 'Visionboard', href: '/visionboard', icon: CloudIcon },
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Net Worth', href: '/net-worth', icon: ChartBarIcon },
  { name: 'Recurring Charges', href: '/recurring', icon: ArrowPathIcon },
  { name: 'Goals', href: '/goals', icon: SparklesIcon },
]

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function ({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const currentRoute = router.pathname

  return (
    <Disclosure as="nav" className="container mx-auto px-5 bg-white">
      {({ open }) => (
        <>
          <div>
            <div className="flex h-18 items-center justify-between py-4">
              <div className="w-10 lg:hidden block"></div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href='/'>
                    <div className="f-m-1.5 p-1.5 flex justify-center items-center">
                      <Image
                        src='/trckfi-black-sm.png'
                        alt='Trckfi'
                        width={200}
                        height={100}
                      />
                    </div>
                  </Link>
                </div>
              </div>
              {
                // @ts-ignore
                user?.active &&
                <div className="flex items-center gap-x-6 block lg:hidden justify-center fixed bottom-0 left-0 z-50 w-full bg-white mx-auto pb-5">
                  <Link href="/dashboard" className="mt-5 rounded-3xl bg-pink-600 px-5 py-2.5 text-2xl font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Go To Dashboard
                  </Link>
                </div>
              }

              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  { navigation.map((item) => (
                    <Link href={item.href} key={item.name} className={currentRoute === item.href ? "text-lg font-bold text-pink-600 px-3 py-2" : "text-lg text-gray-900 px-3 py-2 font-semibold"}>
                      {item.name}
                    </Link>
                  ))}
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex items-center">
                      <span className="sr-only">Open user menu</span>
                      <div className={currentRoute.includes('features') ? "text-lg font-bold text-pink-600 px-3 py-2" : "text-lg text-gray-900 px-3 py-2 font-semibold"}>
                        Features
                      </div>
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        { features.map((item) => (
                          <Menu.Item key={item.name}>
                            <Link href={`/features${item.href}`} className={classNames(currentRoute.includes(item.href) ? 'text-pink-600 font-bold' : 'text-gray-400 group-hover:text-pink-600', 'flex items-center px-5 py-3 text-md text-gray-700 w-full text-left hover:bg-gray-100')}>
                              <item.icon className='h-7 w-7 shrink-0 mr-3' aria-hidden="true"/>
                              {item.name}
                            </Link>
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  { // @ts-ignore
                    session && session.user?.active &&
                    <Link href="/visionboard">
                      <b>{session.user.email}</b>
                    </Link>
                  }
                  
                  <Menu as="div" className="relative ml-3">
                    { // @ts-ignore
                      session && session.user?.active ?
                        <div className="flex items-center">
                        <Link href="/profile">
                          <Menu.Button className="flex items-center">
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon className="ml-4 h-8 w-8 text-pink-600" aria-hidden="true" />
                          </Menu.Button>
                        </Link>
                      </div>
                      :
                      <div className="flex space-x-4">
                        <Link href="/auth/email-signin" className="items-center rounded-3xl inline-flex w-full justify-center bg-white px-4 py-2 text-lg border-2 border-pink-600 font-semibold text-pink-600 shadow-sm hover:bg-pink-50 sm:w-auto">
                          Login
                        </Link>
                        <Link href="/pricing" className="items-center rounded-3xl inline-flex w-full justify-center bg-pink-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto">
                          Signup
                        </Link>
                      </div>
                      
                    }
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/profile" className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}>
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/feedback" className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}>
                              Feedback
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                signOut()
                                clearLocalStorage()
                              }}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel>
            <div className="space-y-1 px-2">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              { navigation.map((item) => (
                  <Disclosure.Button
                    as="a"
                    href={item.href}
                    key={item.name}
                    className={currentRoute === item.href ? "block font-bold text-pink-600 px-3 py-1" : "block text-gray-900 px-3 py-1"}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))
              }
               <Disclosure.Button
                as="a"
                className={currentRoute.includes('features') ? "block font-bold text-pink-600 px-3 py-1" : "block text-gray-900 px-3 py-1"}
              >
                Features
              </Disclosure.Button>
              { features.map((item) => (
                <Disclosure.Button
                  as="a"
                  href={item.href}
                  key={item.name}
                  className={currentRoute.includes(item.href) ? "flex items-center font-bold text-pink-600 pl-10 py-1" : "flex items-center text-gray-900 pl-10 py-1"}
                >
                  <item.icon className='h-7 w-7 shrink-0 mr-3' aria-hidden="true"/>
                  {item.name}
                </Disclosure.Button>
              ))}
              <br/>
              { // @ts-ignore
                session && session.user?.active ?
                <div className="my-2 space-y-1">
                  <Disclosure.Button
                    as="button"
                    onClick={() => signOut()}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
                :
                <LoginBtn />
              }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
