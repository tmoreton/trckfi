import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon, CheckBadgeIcon, FaceFrownIcon } from '@heroicons/react/20/solid'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSession } from "next-auth/react"

export default function ({ showError }) {
  const [show, setShow] = useState(false)
  const [answer, setAnswer] = useState(null)
  const [question, setQuestion] = useState(null)
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    // @ts-ignore
    if(user && user.login_count > 0) getQuestion()
  }, [])

  const getQuestion = async () => {
    const res = await fetch(`/api/get_question`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    
    if(data){
      setQuestion(data)
      setShow(true)
    }
  }

  const addAnswer = async (input) => {
    setAnswer(input)
    const res = await fetch(`/api/add_answer`, {
      body: JSON.stringify({
        data: {
          // @ts-ignore
          user_id: user.id,
          correct: question?.answer === input,
          question_id: question.id
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
  }

  const onClose = async () => {
    setShow(false)
    setAnswer(null)
    setQuestion(null)
  }

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
            <div style={{backgroundColor: '#db2777'}} className="pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                  <div className="ml-3 mb-3 w-0 flex-1">
                    <p className="text-md text-white">Question of the day</p>
                    <p className="py-3 text-md font-semibold text-white">{question?.question}</p>
                    { answer === null ?
                      <div className="mt-4 flex">
                        <button
                          type="button"
                          onClick={() => addAnswer(true)}
                          className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-md font-semibold text-pink-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                          True
                        </button>
                        <button
                          type="button"
                          onClick={() => addAnswer(false)}
                          className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-md font-semibold text-pink-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                          False
                        </button>
                      </div>
                      :
                      <div className="flex">
                        {/* Correct Answer */}
                        { answer !== null && question?.answer === answer &&
                          <div className="w-0 flex-1">
                            <p className="text-md text-white mb-2">Answer: <span className="font-bold">{JSON.stringify(question?.answer)}</span></p>
                            <p className="text-lg font-semibold text-white flex items-center">Correct! <CheckBadgeIcon className="ml-2 h-5 w-5" aria-hidden="true" /></p>
                            <p className="py-3 text-md font-normal text-white">{question?.detail}</p>
                            <ConfettiExplosion />
                          </div>
                        }
                        {/* Wrong Answer */}
                        { answer !== null && question?.answer !== answer &&
                          <div className="w-0 flex-1">
                            <p className="text-md text-white mb-2">Answer: {JSON.stringify(question?.answer)}</p>
                            <p className="text-lg font-semibold text-white flex items-center"><FaceFrownIcon className="h-7 w-7" aria-hidden="true" /></p>
                            <p className="py-3 text-md font-normal text-white">{question?.detail}</p>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md text-white hover:text-gray-100"
                      onClick={onClose}
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
