import { Fragment, useState } from 'react'
import { Cog8ToothIcon, AdjustmentsHorizontalIcon  } from '@heroicons/react/24/solid'
import { Bars3Icon, XMarkIcon  } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import LoginBtn from './login-btn'
import { useSession, signOut } from "next-auth/react"
import CancelModal from './modals/cancel-modal'
import Image from 'next/image'
import { PinkBtn } from './pink-btn'
import  { clearLocalStorage } from '../utils/useLocalStorage'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
]

const dashboardNavigation = [
  { name: 'VisionBoard', href: '/visionboard' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Accounts', href: '/accounts' },
  { name: 'Settings', href: '/settings' },
]

const secondaryNavigation = [ '/visionboard', '/dashboard', '/accounts', '/settings', '/net-worth', '/rules']

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function ({ showError }) {
  const [openModal, setOpen] = useState(false)
  const [controls, showControls] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const currentRoute = router.pathname

  const addControls = () => {
    if(!controls){
      showControls(true)
      document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
        item.classList.remove('hidden');
      });
      document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
        item.classList.remove('hidden');
      });
    } else {
      showControls(false)
      document.querySelectorAll('.tlui-layout__top__right').forEach(item => {
        item.classList.add('hidden');
      });
      document.querySelectorAll('.tlui-menu-zone__controls').forEach(item => {
        item.classList.add('hidden');
      });
    }

  }

  return (
    <Disclosure as="nav" className="container mx-auto px-5 bg-white">
      {({ open }) => (
        <>
          <div>
            <CancelModal showError={showError} open={openModal} setOpen={setOpen} signOut={signOut} user={user}/>
            <div className="flex h-18 items-center justify-between py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href='/'>
                    <div className="f-m-1.5 p-1.5 flex justify-center items-center">
                      <Image
                        src='/trckfi-logo-beta.png'
                        alt='Trckfi'
                        width={200}
                        height={100}
                      />
                    </div>
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {!secondaryNavigation.includes(currentRoute) && navigation.map((item) => (
                    <Link href={item.href} key={item.name} className={currentRoute === item.href ? "text-lg font-bold text-pink-600 px-3 py-2" : "text-lg text-gray-900 px-3 py-2 font-semibold"}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  { session &&
                    <Link href="/visionboard">
                      <b>{session.user.email}</b>
                    </Link>
                  }
                  
                  <Menu as="div" className="relative ml-3">
                  {/* <Menu as="div" className="ml-3"> */}
                    {
                      session ?
                      <div className="flex items-center">
                        <Link href="/settings">
                          <Menu.Button className="flex items-center">
                            <span className="sr-only">Open user menu</span>
                            <Cog8ToothIcon className="ml-4 h-8 w-8 text-pink-600" aria-hidden="true" />
                          </Menu.Button>
                        </Link>
                        {
                          currentRoute === '/visionboard' &&
                          <button onClick={addControls} >
                            <AdjustmentsHorizontalIcon className="ml-4 h-8 w-8 text-pink-600" aria-hidden="true" />
                          </button>
                        }  
                      </div>

                      :
                      
                      <Link href="/#get-notified">
                        <PinkBtn onClick={() => console.log('close')}>
                          Join Waitlist!
                        </PinkBtn>
                      </Link>
                      // <LoginBtn />
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
                            <Link href="/settings" className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                              )}>
                              Settings
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
            <div className="space-y-1 px-2 py-2 border-b border-gray-300 my-4">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              {!secondaryNavigation.includes(currentRoute) ? 
                navigation.map((item) => (
                  <Disclosure.Button
                    as="a"
                    href={item.href}
                    key={item.name}
                    className={currentRoute === item.href ? "block font-bold text-pink-600 px-3 py-2" : "block text-gray-900 px-3 py-2"}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))
                :
                dashboardNavigation.map((item) => (
                  <Disclosure.Button
                    as="a"
                    href={item.href}
                    key={item.name}
                    className={currentRoute === item.href ? "block font-bold text-pink-600 px-3 py-2" : "block text-gray-900 px-3 py-2"}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))
              }
              {
                session ?
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
                <Link href="/#get-notified">
                  <PinkBtn onClick={() => console.log('close')}>
                    Join Waitlist!
                  </PinkBtn>
                </Link>
                // <LoginBtn />
              }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
