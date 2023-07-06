import { Fragment, useState } from 'react'
import { Cog8ToothIcon  } from '@heroicons/react/24/solid'
import { Bars3Icon, XMarkIcon  } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LoginBtn from './login-btn'
import { useSession, signOut } from "next-auth/react"
import CancelModal from './cancel-modal'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'My Dashboard', href: '/dashboard' },
]

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function () {
  const [openModal, setOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const currentRoute = router.pathname
  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div>
            <CancelModal open={openModal} setOpen={setOpen} signOut={signOut} user={user}/>
            <div className="flex h-16 items-center justify-between py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href='/'>
                    <div className="f-m-1.5 p-1.5 flex justify-center items-center">
                      <svg className="h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="75" height="75" ><path fill="#db2777" d="M400 96l0 .7c-5.3-.4-10.6-.7-16-.7H256c-16.5 0-32.5 2.1-47.8 6c-.1-2-.2-4-.2-6c0-53 43-96 96-96s96 43 96 96zm-16 32c3.5 0 7 .1 10.4 .3c4.2 .3 8.4 .7 12.6 1.3C424.6 109.1 450.8 96 480 96h32l-18.8 75.1c15.8 14.8 28.7 32.8 37.5 52.9H544c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32H512c-9.1 12.1-19.9 22.9-32 32v64c0 17.7-14.3 32-32 32H416c-17.7 0-32-14.3-32-32V448H256v32c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V416c-34.9-26.2-58.7-66.3-63.2-112H68c-37.6 0-68-30.4-68-68s30.4-68 68-68h4c13.3 0 24 10.7 24 24s-10.7 24-24 24H68c-11 0-20 9-20 20s9 20 20 20H99.2c12.1-59.8 57.7-107.5 116.3-122.8c12.9-3.4 26.5-5.2 40.5-5.2H384zm64 136c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z"/></svg>
                      <h1 className="ml-3 text-3xl font-semibold font-semibold leading-6 text-gray-900">Trckfi</h1>
                    </div>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      {navigation.map((item) => (
                      <Link href={item.href} key={item.name} className={currentRoute === item.href ? "font-bold text-pink-600 px-3 py-2" : "text-gray-900 px-3 py-2"}>
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    {
                      session ?
                      <Menu.Button className="flex items-center">
                        <b>{session.user.email}</b>
                        <span className="sr-only">Open user menu</span>
                        <Cog8ToothIcon className="ml-4 h-8 w-8 text-pink-600" aria-hidden="true" />
                      </Menu.Button>
                      :
                      <LoginBtn />
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => setOpen(true)}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}
                            >
                              Cancel Subscription
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
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

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 border-t border-gray-300 mt-4">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              {navigation.map((item) => (
                <Disclosure.Button
                  as="a"
                  href={item.href}
                  key={item.name}
                  className={currentRoute === item.href ? "block font-bold text-pink-600 px-3 py-2" : "block text-gray-900 px-3 py-2"}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="pb-3 pt-4">
              {
                session ?
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    as="button"
                    onClick={() => setOpen(true)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    Cancel Subscription
                  </Disclosure.Button>
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
