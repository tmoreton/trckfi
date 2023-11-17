import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon, BellAlertIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import EmojiPicker from 'emoji-picker-react'
import { Emoji } from 'emoji-picker-react'
import { PinkBtn } from '../pink-btn'
import DatePicker from "react-datepicker"
import { DateTime } from "luxon"
// import Select, { StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';

const colourStyles = {
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: '#db2777',
    color: '#fff',
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: '#db2777',
    color: '#fff'
  }),
}
export default function ({ item, setEdit, showError, selected, user, transactions, setTransactions }) {
  const defaultTransaction = {
    name: null,
    custom_name: null,
    primary_category: null,
    detailed_category: null,
    amount: null,
    unified: null,
    notes: null,
    new: false,
    date: null,
    alert_date: null,
    account_id: null,
    tags: []
  }
  const [transaction, setTransaction] = useState(defaultTransaction)
  const [ids, setIds] = useState([])
  const [showEmoji, updateShowEmoji] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [alertDate, setAlertDate] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [primary_categories, setPrimary] = useState([])
  const [detailed_categories, setDetailed] = useState([])
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    getAccounts()
    getCategories()
    setAlertDate(null)
    let new_ids = selected.length > 0 ? selected.map(s => s.id) : [item?.id]
    setIds(new_ids)
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
    let suggested = data.tags.map(tag => ({ label: tag, value: tag}))
    setSuggestions(suggested)
  }

  const update = async () => {
    setEdit({})
    // @ts-ignore
    let new_transactions = transactions.filter((data) => data.id !== transaction.id)
    const res = await fetch(`/api/update_transaction`, {
      body: JSON.stringify({ 
        transaction,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, updated_transaction } = await res.json()
    showError(error)
    new_transactions.push(updated_transaction)
    setTransactions(new_transactions)
  }

  const updateMany = async () => {
    setEdit({})
    // @ts-ignore
    let new_transactions = transactions.filter((data) => !ids.includes(data.id))
    const res = await fetch(`/api/update_transactions`, {
      body: JSON.stringify({ 
        transaction,
        ids
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, updated_transactions } = await res.json()
    showError(error)
    let new_tranasctions = new_transactions.concat(updated_transactions)
    setTransactions(new_tranasctions)
  }

  const remove = async () => {
    let new_transactions = transactions.filter((data) => !ids.includes(data.id))
    setTransactions(new_transactions)
    setEdit({})
    await fetch(`/api/remove_transaction`, {
      body: JSON.stringify({ 
        ids
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  const add = async (e) => {
    e.preventDefault()
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
    const { error, new_transaction } = await res.json()
    showError(error)
    let new_transactions = transactions
    new_transactions.push(new_transaction)
    setTransactions(new_transactions)
  }

  // const addRule = async () => {
  //   const res = await fetch(`/api/add_rule`, {
  //     body: JSON.stringify({
  //       user,
  //       // @ts-ignore
  //       identifier: transaction?.merchant_name || transaction?.name,
  //       ruleset: {
  //         // @ts-ignore
  //         name: transaction?.custom_name || transaction?.merchant_name || transaction?.name,
  //         primary_category: transaction?.primary_category,
  //         detailed_category: transaction?.detailed_category,
  //         unified: transaction?.unified
  //       }
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //   })
  //   const { error } = await res.json()
  //   showError(error)
  //   if(!error) router.reload()
  // }

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
          <div className="block lg:flex min-h-full items-center justify-center p-5">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg mb-[75px] mb-[75px]">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="mt-3 sm:mt-0">
                      <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900 mb-4 flex justify-center">
                        { transaction.new ? 'Add Transaction' : 'Edit Transaction' }
                        <span className="ml-4" onClick={() => updateShowEmoji(true)}>
                          <Emoji unified={transaction.unified} size={25} />
                        </span>
                      </Dialog.Title>
                      <XMarkIcon onClick={() => setEdit({})} className="h-10 w-10 absolute top-2 right-2"/>
                      { showEmoji ? 
                      <EmojiPicker onEmojiClick={updateEmoji}/> 
                      :
                      <>
                        <form onSubmit={add}>
                          <div className="relative w-full mb-4 group inline-flex">
                            <div className="w-full">
                              <label 
                                htmlFor="account_id" 
                                className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Account
                              </label>
                              <CreatableSelect
                                closeMenuOnSelect={true}
                                onChange={e => setTransaction({ ...transaction, account_id: e.value })}
                                // @ts-ignore
                                defaultValue={{ label: transaction?.account?.name, value: transaction.account_id }}
                                options={accounts.map(a => ({ label: a.name, value: a.id}))}
                                styles={colourStyles}
                              />
                            </div>
                          </div>
                          <div className="relative w-full mb-4 group">
                            <label 
                              htmlFor="primary_category" 
                              className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                              Primary Category
                            </label>
                            <CreatableSelect
                              // isMulti
                              closeMenuOnSelect={true}
                              value={{ label: transaction?.primary_category, value: transaction?.primary_category }}
                              onChange={e => setTransaction({ ...transaction, primary_category:e.value.toUpperCase()})}
                              // onChange={e => setTransaction({ ...transaction, primary_category: e?.length > 1 && e?.slice(-1).pop().value.toUpperCase()})}
                              defaultValue={{ label: transaction.primary_category, value: transaction.primary_category }}
                              options={primary_categories.map(category => ({ label: category.primary_category, value: category.primary_category}))}
                              styles={colourStyles}
                            />
                          </div>
                          <div className="relative w-full mb-3 group">
                            <label 
                              htmlFor="primary_category" 
                              className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                              Detailed Category
                            </label>
                            <CreatableSelect
                              // isMulti
                              closeMenuOnSelect={true}
                              value={{ label: transaction.detailed_category, value: transaction.detailed_category }}
                              onChange={e => setTransaction({ ...transaction, detailed_category: e.value.toUpperCase()})}
                              // onChange={e => setTransaction({ ...transaction, detailed_category: e?.slice(-1).pop().value.toUpperCase() })}
                              defaultValue={{ label: transaction.detailed_category, value: transaction.detailed_category }}
                              options={detailed_categories.map(category => ({ label: category.detailed_category, value: category.detailed_category}))}
                              styles={colourStyles}
                            />
                          </div>
                          <div className="relative w-full mb-4 group inline-flex">
                            <div className="w-full">
                              <label 
                                htmlFor="tags" 
                                className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                                Tags
                              </label>
                              <CreatableSelect
                                isMulti
                                closeMenuOnSelect={true}
                                onChange={e => setTransaction({ ...transaction, tags: e.map(t => t.value.toUpperCase()) })}
                                defaultValue={transaction?.tags?.map(t => ({ label: t.toUpperCase(), value: t.toUpperCase()}))}
                                options={suggestions}
                                styles={colourStyles}
                              />
                            </div>
                          </div>
                         
                          <div className="relative w-full mb-8 group inline-flex">
                            <div className="w-full">
                              <label 
                                htmlFor="transaction_name" 
                                className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Name
                              </label>
                              <input 
                                type="text" 
                                name="custom_name"
                                id="transaction_name" 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                                required
                                value={transaction?.custom_name || transaction?.name}
                                onChange={handleChange}
                              />
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
                                required
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
                          <div className="sm:flex items-center">
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
                              </button> }
                            </div>
                            <div className="sm:flex sm:flex-row-reverse items-center py-2">
                              {
                                transaction.new ?
                                <PinkBtn type="submit" onClick={() => {}}>
                                  Add
                                </PinkBtn>
                                :
                                <PinkBtn type="button" onClick={ids.length > 1 ? updateMany : update}>
                                  <p>Update</p>
                                </PinkBtn>
                              }
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => setEdit({})}
                              >
                                Cancel
                              </button>
                              { !transaction.new &&
                              <button
                                type="button"
                                onClick={remove}
                              >
                                <TrashIcon onClick={remove} className="h-5 w-5 text-red-400" aria-hidden="true" />
                              </button>
                              }
                            </div>
                          </div>
                        </form>
                      </>
                      }
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