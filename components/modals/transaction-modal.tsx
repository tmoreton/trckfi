import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon, BellAlertIcon, XCircleIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import EmojiPicker from 'emoji-picker-react'
import { Emoji } from 'emoji-picker-react'
import { PinkBtn } from '../pink-btn'
import DatePicker from "react-datepicker"
import { DateTime } from "luxon"
import Dropdown from '../dropdown'
import { clearLocalStorage } from "../../utils/useLocalStorage"

export default function ({ item, setEdit, getDashboard, showError, selected, user }) {
  const defaultTransaction = {
    name: null,
    primary_category: null,
    detailed_category: null,
    amount: null,
    unified: null,
    notes: null,
    new: false,
    date: null,
    alert_date: null,
    account_id: null,
  }
  const [transaction, setTransaction] = useState(defaultTransaction)
  const [ids, setIds] = useState([])
  const [showEmoji, updateShowEmoji] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [alertDate, setAlertDate] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [primary_categories, setPrimary] = useState([])
  const [detailed_categories, setDetailed] = useState([])

  useEffect(() => {
    getAccounts()
    getCategories()
    setAlertDate(null)
    setIds(selected.map(s => s.id))
    setTransaction(item)
    if(item?.date){
      setStartDate(new Date(item.date.replace(/-/g, '\/')))
    } else {
      setStartDate(null)
    }
    if(item?.alert_date){
      setAlertDate(new Date(item.alert_date))
    }
  }, [item, selected])

  useEffect(() => {
    const date_time = DateTime.fromJSDate(startDate).toFormat('yyyy-MM-dd')   
    setTransaction({ ...transaction, date: date_time })
  }, [startDate])

  useEffect(() => {
    setTransaction({ ...transaction, alert_date: alertDate })
  }, [alertDate])

  const updateEmoji = (e) => {
    setTransaction({ ...transaction, unified: e.unified })
    updateShowEmoji(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setTransaction({ ...transaction, [name]: value })
  }

  const handleDropdown = (e) => {
    const name = Object.keys(e)[0]
    setTransaction({ ...transaction, [name]: e[name] })
  }

  const getAccounts = async () => {
    const res = await fetch(`/api/get_accounts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    if(!error) setAccounts(data)
  }

  const getCategories = async () => {
    const res = await fetch(`/api/get_categories`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setPrimary(data.primary_categories)
    setDetailed(data.detailed_categories)
  }

  const update = async () => {
    clearLocalStorage()
    setEdit({})
    const res = await fetch(`/api/update_transaction`, {
      body: JSON.stringify({ 
        transaction,
        ids
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getDashboard()
  }

  const remove = async () => {
    const res = await fetch(`/api/remove_transaction`, {
      body: JSON.stringify({ 
        transaction,
        ids
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if (!error){
      getDashboard()
      setEdit({})
    }
  }

  const add = async () => {
    const res = await fetch(`/api/add_transaction`, {
      body: JSON.stringify({ 
        transaction,
        user,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if (!error){
      getDashboard()
      setEdit({})
    }
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
                        { transaction.new ? 'Add Transaction' : 'Edit Transaction' }
                        <span className="ml-4" onClick={() => updateShowEmoji(true)}>
                          <Emoji unified={transaction.unified} size={25} />
                        </span>
                      </Dialog.Title>
                      { showEmoji ? 
                      <EmojiPicker onEmojiClick={updateEmoji}/> 
                      :
                      <>
                        <form>
                          <div className="relative z-0 w-full mb-4 group inline-flex">
                            <div className="w-full">
                            <label 
                                htmlFor="account_id" 
                                className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Account
                              </label>
                              <select
                                id="account_id"
                                name="account_id"
                                onChange={handleChange}
                                // @ts-ignore
                                defaultValue={transaction?.account_id}
                                value={transaction?.account_id}
                                className="mt-2 w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 order-0 border-y border-x border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 sm:text-sm sm:leading-6"
                              >
                                <option/>
                                {accounts.map((a) => (
                                  <option key={a.id} value={a.id} label={`${a.name} - ${a.official_name}`}/>
                                ))}                                
                              </select>
                              <div className="absolute inset-y-0 mt-8 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                            </div>
                          </div>
                          <div className="relative z-0 w-full mb-4 group">
                            <label 
                              htmlFor="primary_category" 
                              className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                              Primary Category
                            </label>
                            <Dropdown 
                              values={primary_categories.filter(c => c.primary_category.includes(transaction.primary_category?.toUpperCase()))} 
                              selected={transaction.primary_category} 
                              setSelected={e => handleDropdown({ primary_category: e.primary_category })} 
                              onChange={e => setTransaction({ ...transaction, primary_category: e })}
                            />
                          </div>
                          <div className="relative z-0 w-full mb-8 group">
                            <label 
                              htmlFor="primary_category" 
                              className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                              Detailed Category
                            </label>
                            <Dropdown 
                              values={detailed_categories.filter(c => c.detailed_category.includes(transaction.detailed_category?.toUpperCase()))} 
                              selected={transaction.detailed_category} 
                              setSelected={e => handleDropdown({ detailed_category: e.detailed_category })} 
                              onChange={e => setTransaction({ ...transaction, detailed_category: e })}
                            />
                          </div>
                          <div className="relative z-0 w-full mb-8 group inline-flex">
                            <div className="w-full">
                              <input 
                                type="text" 
                                name="name" 
                                id="transaction_name" 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                                required
                                value={transaction?.name}
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
                                type="text" 
                                name="amount" 
                                id="amount" 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                                required
                                value={transaction?.amount}
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
                                selected={startDate} 
                                onChange={(date) => setStartDate(date)}
                              />
                              <label 
                                htmlFor="date" 
                                className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Date
                              </label>
                            </div>
                          </div>
                          <div className="relative z-0 w-full mb-6 group inline-flex">
                            <textarea
                              rows={4}
                              name="notes"
                              id="notes"
                              value={transaction?.notes}
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              onChange={handleChange}
                            />
                            <label 
                              htmlFor="notes" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Notes
                            </label>
                          </div>
                        </form>
                        <div className="relative z-0 w-full group">
                        { alertDate ?
                          <div className="inline-flex items-center">
                            <DatePicker 
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              selected={alertDate} 
                              onChange={(date) => setAlertDate(date)}
                            />
                            <label 
                              htmlFor="date" 
                              className="left-0 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Alert Date
                            </label>
                            <XCircleIcon onClick={() => setAlertDate(null)} className="h-5 w-5 text-red-400 mr-4"/>
                          </div>
                          :
                          <button onClick={() => setAlertDate(new Date())} className="text-sm text-gray-500 inline-flex font-semibold">
                            <BellAlertIcon className="h-5 w-5 text-red-400 mr-4" aria-hidden="true"/> 
                            Set Alert
                          </button>
                        }
                        </div>
                      </>
                      }
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center">
                  {
                    transaction.new ?
                    <PinkBtn onClick={add}>
                      Add
                    </PinkBtn>
                    :
                    <PinkBtn onClick={update}>
                      { ids.length > 0 ? 'Update Selected' : 'Update'}
                    </PinkBtn>
                  }
                  <button
                    type="button"
                    className="mr-3 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setEdit({})}
                  >
                    Cancel
                  </button>
                  <TrashIcon onClick={remove} className="h-5 w-5 text-red-400 mr-4" aria-hidden="true" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}