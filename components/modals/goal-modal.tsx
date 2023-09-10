import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/20/solid'
import EmojiPicker from 'emoji-picker-react'
import { Emoji } from 'emoji-picker-react'
import { PinkBtn } from '../pink-btn'
import DatePicker from "react-datepicker"
import { DateTime } from "luxon"
import { useRouter } from 'next/router'

export default function ({ item, setEdit, showError, selected, user }) {
  const defaultGoal = {
    name: null,
    date: null,
    unified: null,
    amount: null
  }
  const [goal, setGoal] = useState(defaultGoal)
  const [date, setDate] = useState(null)
  const [showEmoji, updateShowEmoji] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setGoal(item)
    if(item?.date){
      setDate(new Date(item.date.replace(/-/g, '\/')))
    } else {
      setDate(null)
    }
  }, [item, selected])

  const updateEmoji = (e) => {
    setGoal({ ...goal, unified: e.unified })
    updateShowEmoji(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setGoal({ ...goal, [name]: value })
  }

  const addGoal = async () => {
    // const res = await fetch(`/api/add_goal`, {
    //   body: JSON.stringify({
    //     user,
    //     goal
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // })
    // const { error } = await res.json()
    // showError(error)
    // if(!error) router.reload()
  }

  const remove = async () => {

  }

  return (
    <Transition.Root show={Object.keys(item).length !== 0} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setEdit({})}>
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
                      <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900 mb-4 flex justify-center">
                        Add Goal!
                        <span className="ml-4" onClick={() => updateShowEmoji(true)}>
                          <Emoji unified={goal.unified} size={25} />
                        </span>
                      </Dialog.Title>
                      { showEmoji ? 
                      <EmojiPicker onEmojiClick={updateEmoji}/> 
                      :
                      <form onSubmit={addGoal}>
                        <div className="relative z-0 w-full mb-8 group inline-flex">
                          <div className="w-full">
                            <input 
                              type="text" 
                              name="custom_name"
                              id="transaction_name" 
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                              required
                              value={goal?.name}
                              onChange={handleChange}
                            />
                            <label 
                              htmlFor="transaction_name" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Name
                            </label>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                          <div className="relative z-0 w-full mb-6 group">
                            <input 
                              type="number" 
                              name="amount" 
                              id="amount" 
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              required
                              value={goal?.amount}
                              onChange={handleChange}
                            />
                            <label 
                              htmlFor="amount" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Amount
                            </label>
                          </div>
                          <div className="relative z-0 w-full mb-6 group">
                            <DatePicker 
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              selected={date}
                              required
                              onChange={(date) => setDate(date)}
                            />
                            <label 
                              htmlFor="date" 
                              className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Date
                            </label>
                          </div>
                        </div>
                        <div className="sm:flex items-center">
                          <div className="sm:flex sm:flex-row-reverse items-center">
                            <PinkBtn type="button" onClick={() => console.log('adding goal')}>
                              <p className="w-[135px]">Add Goal</p>
                            </PinkBtn>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setEdit({})}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={remove}
                            >
                              <TrashIcon onClick={remove} className="h-5 w-5 text-red-400" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </form>}
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