import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon, CheckBadgeIcon, FaceFrownIcon } from '@heroicons/react/20/solid'
import  { useLocalStorage } from '../utils/useLocalStorage'
import ConfettiExplosion from 'react-confetti-explosion'

export default function () {
  const [show, setShow] = useLocalStorage('show_notification', true)
  // const [show, setShow] = useState(true)
  const [answer, setAnswer] = useState(null)

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-20"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-pink-600 pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="/trckfi-icon-white.png"
                      alt="trckfi-icon"
                    />
                  </div>
                  {/* Initial question */}
                  { answer === null &&
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-md text-white">Question of the day</p>
                      <p className="py-3 text-md font-semibold text-white">You should check your credit report once every few years?</p>
                      <div className="mt-4 flex">
                        <button
                          type="button"
                          onClick={() => setAnswer(true)}
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-md font-semibold text-pink-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                          True
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswer(false)}
                          className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-md font-semibold text-pink-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                          False
                        </button>
                      </div>
                    </div>
                  }
                  {/* Correct Answer */}
                  { answer &&
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-lg font-semibold text-white flex items-center">Correct! <CheckBadgeIcon className="ml-2 h-5 w-5" aria-hidden="true" /></p>
                      <p className="py-3 text-md font-normal text-white">Ideally, you should check your credit report once a year. Typically your credit card has a free version to check your credit score to keep you up to date.</p>
                      <ConfettiExplosion />
                    </div>
                  }
                  {/* Wrong Answer */}
                  { !answer && answer !== null &&
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-lg font-semibold text-white flex items-center"><FaceFrownIcon className="h-7 w-7" aria-hidden="true" /></p>
                      <p className="py-3 text-md font-normal text-white">Ideally, you should check your credit report once a year. Typically your credit card has a free version to check your credit score to keep you up to date.</p>
                    </div>
                  }
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md text-white hover:text-gray-100"
                      onClick={() => setShow(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-7 w-7" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}
