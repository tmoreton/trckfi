import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import { Transition } from '@headlessui/react'

export default function ({ success, setSuccess }) {
  return (
    <Transition
      show={success !== null}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
    <div className="flex justify-center items-center absolute right-0 left-0 z-10">
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-7 w-7 text-green-400" aria-hidden="true" />
          </div>
          <div className="mx-5">
            <p className="text-lg font-medium text-green-800">{success}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => setSuccess(null)}
                className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-7 w-7" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  )
}
