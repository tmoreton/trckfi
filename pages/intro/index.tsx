import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/router'
const items = [
  { text: 'Keep track of my transactions' },
  { text: 'Track and grow my net worth to financial independence' },
  { text: 'Learn more about finance and improve my overall financal knowledge' },
  { text: 'Help pay off my debt' }
]

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
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
        {/* <svg
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
        </svg> */}
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <Image
              src='/trckfi-logo-beta.png'
              alt='Trckfi'
              width={150}
              height={100}
            />
            <h1 className="mt-6 text-4xl font-bold text-gray-900 sm:text-7xl leading-tight">
              Welcome to Trckfi! 🎉
            </h1>
            <p className="mt-6 pb-2 text-3xl text-gray-600">
              We want to be there along your side on your path to financial success! 
            </p>
            <p className="mb-10 text-3xl text-gray-600">
              How can Trckfi help you along the way?
            </p>
            <ul role="list" className="my-10 space-y-8 text-xl leading-6 text-gray-600">
              {items.map((i, id) => (
                <li key={id} className="gap-x-3">
                  <div className="rounded-lg bg-gray-100 ring-1 ring-gray-900/10 flex items-center p-4">
                    <button>
                      <CheckCircleIcon className="h-10 w-10 mr-4 text-white" aria-hidden="true" />
                    </button>
                    {i.text}
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpen(true)}
              type="button"
              className="mt-7 rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Setup Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

