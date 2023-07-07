import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/20/solid'

export default function ({ item, setEdit, getDashboard }) {
  const [transaction, updateTransaction] = useState({
    name: '',
    primary_category: '',
    detailed_category: '',
    amount: 0
  })

  useEffect(() => {
    updateTransaction(item);
  }, [item])

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateTransaction({ ...transaction, [name]: value })
  }

  const update = async () => {
    const res = await fetch(`/api/update_transaction`, {
      body: JSON.stringify({ 
        transaction: transaction
    }),
      method: 'POST',
    })
    if (res.status === 200){
      getDashboard()
      setEdit({})
    }
  }

  const remove = async () => {
    const res = await fetch(`/api/remove_transaction`, {
      body: JSON.stringify({ 
        transaction: transaction
    }),
      method: 'POST',
    })
    if (res.status === 200){
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
                      <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900 mb-4">
                        Edit Transaction
                      </Dialog.Title>
                      <form>
                        <div className="relative z-0 w-full mb-6 group">
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
                        <div className="relative z-0 w-full mb-6 group">
                          <input 
                            type="text" 
                            name="primary_category" 
                            id="primary_category" 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                            required 
                            value={transaction?.primary_category}
                            onChange={handleChange}
                          />
                          <label 
                            htmlFor="primary_category" 
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"                          >
                            Primary Category
                          </label>
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <input 
                            type="text" 
                            name="detailed_category" 
                            id="detailed_category" 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                            required 
                            value={transaction?.detailed_category}
                            onChange={handleChange}
                          />
                          <label 
                            htmlFor="detailed_category" 
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Detailed Category
                          </label>
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
                          {/* <div className="relative z-0 w-full mb-6 group">
                            <input 
                              type="text" 
                              name="date" 
                              id="date" 
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              required
                              value={transaction?.date}
                              onChange={handleChange}
                            />
                            <label 
                              for="date" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Date
                            </label>
                          </div> */}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 sm:ml-3 sm:w-auto"
                    onClick={update}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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