import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import  { useLocalStorage } from '../../utils/useLocalStorage'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

export default ({ open, setOpen }) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [subscribed, setSubscribed] = useLocalStorage('subscribed', false)

  const subscribe = async (e) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
    await fetch(`/api/add_email`, {
      body: JSON.stringify({
        email,
        name,
        type: 'bundle'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  // const onClose = () => {
  //   setSubscribed(true)
  //   setOpen(false)
  // }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel>
                <div className="relative isolate overflow-hidden bg-white p-10 shadow-2xl rounded-2xl sm:px-12 max-w-4xl mx-auto">
                  <div className="relative isolate">
                    <div className="flex justify-end" onClick={() => setOpen(false)}>
                      <XMarkIcon className="h-10 w-10" />
                    </div>
                    <div className="mx-auto max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-10">
                      <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto w-80 lg:min-w-[350px]">
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-4xl leading-tight">
                          Start Tracking Your Expenses Today!
                        </h1>
                        <p className="mt-6 text-md leading-8 text-gray-600">
                          Not sure where to get started? <br/> Try out this <b>Free</b> Google Sheets financial tracker.
                        </p>
                        <ul role="list" className="my-4 space-y-3 text-md leading-6 text-gray-600">
                          <li className="flex items-center gap-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                            Track transactions
                          </li>
                          <li className="flex items-center gap-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                            Custom Categories
                          </li>
                          <li className="flex items-center gap-x-3">
                            <CheckCircleIcon className="h-5 w-5 text-pink-600" aria-hidden="true" />
                            Google Sheets Integration
                          </li>
                        </ul>
                        <form onSubmit={subscribe}>
                          <div className="mx-auto flex max-w-md gap-x-4 pt-5">
                          {
                            !subscribed &&
                            <>
                              <input
                                autoComplete="name"
                                id="name"
                                name="name"
                                value={name}
                                placeholder="Name"
                                onChange={e => setName(e.target.value)}
                                required
                                type="name"
                                disabled={subscribed}
                                className="min-w-0 flex-auto rounded-3xl border bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
                              />
                              <input
                                autoComplete="email"
                                id="email"
                                name="email"
                                value={email}
                                placeholder="Email"
                                onChange={e => setEmail(e.target.value)}
                                required
                                type="email"
                                disabled={subscribed}
                                className="min-w-0 flex-auto rounded-3xl border bg-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 sm:text-sm sm:leading-6"
                              />
                            </>
                          }
                          </div>
                          <div className="mx-auto flex max-w-md gap-x-4">
                          {
                            !subscribed ?
                            <button
                              type="submit"
                              className="flex-none w-full rounded-3xl mt-4 bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:none focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                              Get Tracker
                            </button>
                            :
                            <>
                              <a 
                                href="https://docs.google.com/spreadsheets/d/1VHDJ4gsCkQCCZX8q4wD8AOdYv2prU3Du2A0iGzEiJjE/copy"
                                target="_blank"
                                className="flex-none w-full text-center border-2 border-pink-600 rounded-3xl mt-4 bg-white px-3.5 py-2.5 text-sm font-semibold text-pink-600 shadow-sm focus-visible:outline focus-visible:none focus-visible:outline-offset-2 focus-visible:outline-white">
                                Download Today!
                              </a>
                              <ConfettiExplosion />
                            </>
                          }                        
                          </div>
                        </form>
                      </div>
                      <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                        <Image
                          src="/assets/csv-tracker.png"
                          alt="Trckfi Finance Dashboard"
                          className="max-w-5xl rounded-xl shadow-xl w-full"
                          width={1000}
                          height={300}
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}