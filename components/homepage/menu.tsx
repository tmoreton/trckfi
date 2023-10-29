import { Bars3Icon, XMarkIcon  } from '@heroicons/react/24/outline'
import { Disclosure, Menu } from '@headlessui/react'
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import { PinkBtn } from '../pink-btn'

export default function ({ showError }) {
  const { data: session } = useSession()
  return (
    <Disclosure as="nav" className="container mx-auto px-5 bg-white">
      {({ open }) => (
        <>
          <div>
            <div className="flex h-18 items-center justify-between py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="f-m-1.5 p-1.5 flex justify-center items-center">
                    <Image
                      src='/trckfi-logo-beta.png'
                      alt='Trckfi'
                      width={200}
                      height={100}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  <Menu as="div" className="relative ml-3">
                    <Link href="#get-notified">
                    <button
                      type="button"
                      className="items-center inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto">
                      Get Started!
                    </button>
                    </Link>
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
            <div className="space-y-1 px-2 py-2 my-4">
              <Link href="#get-notified">
                <PinkBtn type="button" onClick={() => console.log('close')}>
                  Get Started
                </PinkBtn>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
