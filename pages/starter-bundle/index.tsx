import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function () {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  const subscribe = async (e) => {
    e.preventDefault()
    fetch(`/api/add_email`, {
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
    router.push({
      pathname: '/starter-bundle/questions',
    })
  }
  
  return (
    <div className="bg-white">
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="block lg:flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="mt-2 w-100 text-center">
                    <Image
                      className="mx-auto w-100 mb-2"
                      src='/trckfi.png'
                      alt='Trckfi'
                      width={30}
                      height={30}
                    />
                    <p className="text-lg text-gray-500">
                      Enter your details below to get the Business Coaching Bundle
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6 space-y-5">
                    <form onSubmit={subscribe}>
                      <input
                        autoComplete="name"
                        id="name"
                        name="name"
                        value={name}
                        placeholder="Name"
                        onChange={e => setName(e.target.value)}
                        required
                        type="name"
                        className="mb-5 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        className="mb-5 shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                      >
                        Start
                      </button>
                    </form>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      
      <div className="relative isolate pt-14">
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <Image
              src='/trckfi-logo-beta.png'
              alt='Trckfi'
              width={150}
              height={100}
            />
            <h1 className="mt-6 text-4xl font-bold text-gray-900 sm:text-7xl leading-tight">
              Get the Business Coaching Bundle
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              Thanks for checking out the video :) If you’d like to grab
              the Business Coaching Bundle, I’ll email it to you totally 
              free of charge. 
            </p>
            <ul role="list" className="mt-6 space-y-3 text-xl leading-6 text-gray-600">
              <li className="flex items-center gap-x-3">
                <CheckCircleIcon className="h-7 w-7 text-pink-600" aria-hidden="true" />
                Test
              </li>
              <li className="flex items-center gap-x-3">
                <CheckCircleIcon className="h-7 w-7 text-pink-600" aria-hidden="true" />
                Test
              </li>
              <li className="flex items-center gap-x-3">
                <CheckCircleIcon className="h-7 w-7 text-pink-600" aria-hidden="true" />
                Test
              </li>
            </ul>
            <button
              onClick={() => setOpen(true)}
              type="button"
              className="mt-7 rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Get The Bundle
            </button>
          </div>
          
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <svg viewBox="0 0 366 729" role="img" className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl">
              <title>App screenshot</title>
              <defs>
                <clipPath id="2ade4387-9c63-4fc4-b754-10e687a0d332">
                  <rect width={316} height={684} rx={36} />
                </clipPath>
              </defs>
              <path
                fill="#4B5563"
                d="M363.315 64.213C363.315 22.99 341.312 1 300.092 1H66.751C25.53 1 3.528 22.99 3.528 64.213v44.68l-.857.143A2 2 0 0 0 1 111.009v24.611a2 2 0 0 0 1.671 1.973l.95.158a2.26 2.26 0 0 1-.093.236v26.173c.212.1.398.296.541.643l-1.398.233A2 2 0 0 0 1 167.009v47.611a2 2 0 0 0 1.671 1.973l1.368.228c-.139.319-.314.533-.511.653v16.637c.221.104.414.313.56.689l-1.417.236A2 2 0 0 0 1 237.009v47.611a2 2 0 0 0 1.671 1.973l1.347.225c-.135.294-.302.493-.49.607v377.681c0 41.213 22 63.208 63.223 63.208h95.074c.947-.504 2.717-.843 4.745-.843l.141.001h.194l.086-.001 33.704.005c1.849.043 3.442.37 4.323.838h95.074c41.222 0 63.223-21.999 63.223-63.212v-394.63c-.259-.275-.48-.796-.63-1.47l-.011-.133 1.655-.276A2 2 0 0 0 366 266.62v-77.611a2 2 0 0 0-1.671-1.973l-1.712-.285c.148-.839.396-1.491.698-1.811V64.213Z"
              />
              <path
                fill="#343E4E"
                d="M16 59c0-23.748 19.252-43 43-43h246c23.748 0 43 19.252 43 43v615c0 23.196-18.804 42-42 42H58c-23.196 0-42-18.804-42-42V59Z"
              />
              <foreignObject
                width={316}
                height={684}
                transform="translate(24 24)"
                clipPath="url(#2ade4387-9c63-4fc4-b754-10e687a0d332)"
              >
                <img src="https://tailwindui.com/img/component-images/mobile-app-screenshot.png" alt="" />
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

