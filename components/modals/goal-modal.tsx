import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/20/solid'
import EmojiPicker from 'emoji-picker-react'
import { Emoji } from 'emoji-picker-react'
import { PinkBtn } from '../pink-btn'
import DatePicker from "react-datepicker"
import { DateTime } from "luxon"
import { useRouter } from 'next/router'
import { classNames } from '../../lib/lodash'

export default function ({ showGoal, setShowGoal, showError, user }) {
  const defaultGoal = {
    name: null,
    date: null,
    current_amount: null,
    amount: null
  }
  const [goal, setGoal] = useState(defaultGoal)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setGoal({ ...goal, [name]: value })
  }

  const addGoal = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/add_goal`, {
      body: JSON.stringify({
        user,
        goal
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) router.reload()
  }

  const remove = async () => {
    setShowGoal(false)
    setGoal(defaultGoal)
  }

  return (
    <Transition.Root show={showGoal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={remove}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <form onSubmit={addGoal}>
                        <div className="relative z-0 w-full mb-8 group inline-flex">
                          <div className="text-3xl text-gray-900 font-bold w-screen">
                            <div className="py-1">
                              <p>My goal is to save for: </p>
                              <input 
                                type="text" 
                                name="name"
                                id="name"
                                placeholder='Spain 2024! 🇪🇸'
                                className="appearance-none focus:outline-none pt-2" 
                                required
                                value={goal?.name}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="flex items-center py-1">
                              <p>I am starting with $</p>
                              <input 
                                type="number" 
                                name="current_amount" 
                                id="current_amount" 
                                className="appearance-none focus:outline-none pl-1 w-28"  
                                required
                                placeholder='500'
                                value={goal?.current_amount}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="flex items-center py-1">
                              <p>and want to save $</p>
                              <input 
                                type="number" 
                                name="amount" 
                                id="amount"
                                className="appearance-none focus:outline-none pl-1 w-28"  
                                required
                                placeholder='3500'
                                value={goal?.amount}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="flex items-center py-1">
                              <p>by </p>
                              <input 
                                type="date" 
                                name="date" 
                                id="date"
                                className={classNames(
                                  goal?.date
                                    ? 'text-gray-900'
                                    : 'text-gray-400',
                                  'appearance-none focus:outline-none pl-1 w-50'
                                )}
                                required
                                value={goal?.date}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="sm:flex sm:flex-row-reverse justify-between">
                          <div className="sm:flex sm:flex-row-reverse items-center">
                            <PinkBtn type="submit" onClick={() => console.log('adding')}>
                              <p className="w-[135px]">Add Goal</p>
                            </PinkBtn>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={remove}
                            >
                              Cancel
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={remove}
                          >
                            <TrashIcon onClick={remove} className="h-5 w-5 text-red-400" aria-hidden="true" />
                          </button>
                        </div>
                      </form>
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