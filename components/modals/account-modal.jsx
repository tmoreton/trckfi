import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import PinkBtn from '../pink-btn'

import Combobox from '../combobox'

const account_types = [
  { account_type: 'Manual Bank Entry', name: 'Bank Name', institution: 'Instituion', amount: 'Amount' },
  { account_type: 'Home Value', name: 'Custom Name', institution: 'Address', amount: 'Current Est. Value' },
  { account_type: 'Stocks', name: null, institution: 'Stock Symbol', amount: 'Quantity' },
  { account_type: 'Crypto', name: null, institution: 'Crypto Symbol', amount: 'Quantity' }
]

const subtypes = [
  { subtype: 'mortgage', type: 'loan'},
  { subtype: 'credit card', type: 'credit'},
  { subtype: 'savings', type: 'depository'},
  { subtype: 'checking', type: 'depository'},
  { subtype: 'brokerage', type: 'investment'},
  { subtype: 'ira', type: 'investment'},
  { subtype: '401k', type: 'investment'},
  { subtype: 'auto', type: 'loan'},
  { subtype: 'line of credit', type: 'loan'},
]

export default function ({ showError, open, setOpen, user }) {
  const [account, setAccountInfo] = useState({})
  const [stocks, setStocks] = useState([])

  // useEffect(() => {
  //   if(account.account_type === 'Stocks' && account.amount > 0){
  //     if(account.institution?.length > 2){
  //       getStock(account.institution)
  //     }
  //   }
  // }, [account])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo({ ...account, [name]: value })
  }

  const getStock = async ({ query, stock }) => {
    const body = query ? JSON.stringify({search: query}) : JSON.stringify({stock})
    const res = await fetch(`/api/get_stock_price`, {
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
    setStocks(data)
    showError(error)
  }

  const handleSubmit = async () => {
    const res = await fetch(`/api/add_account`, {
      body: JSON.stringify({
        user_id: user.id,
        account
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setOpen(false)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
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
                        Add Account
                      </Dialog.Title>
                      <form onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-8 group">
                          <label 
                            htmlFor="account_type" 
                            className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Type
                          </label>
                          <select
                            id="account_type"
                            name="account_type"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={handleChange}
                          >
                            { account_types.map(t => <option>{t.account_type}</option>) }
                          </select>
                        </div>
                        { account_types.find(t => t.account_type === account?.account_type)?.account_type === 'Manual Bank Entry' &&
                          <div className="relative z-0 w-full mb-8 group">
                            <label 
                              htmlFor="subtype" 
                              className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Sub Type
                            </label>
                            <select
                              id="subtype"
                              name="subtype"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              onChange={e => setAccountInfo({ ...account, type: JSON.parse(e.target.value).type, subtype: JSON.parse(e.target.value).subtype })}
                            >
                              { subtypes.map(t => <option value={JSON.stringify(t)} label={t.subtype}/>) }
                            </select>
                          </div>
                        }
                        {
                          account_types.find(t => t.account_type === account?.account_type)?.name !== null &&
                          <div className="relative z-0 w-full mb-6 group inline-flex">
                            <div className="w-full">
                              <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                                required
                                onChange={handleChange}
                              />
                              <label 
                                htmlFor="name" 
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                {account_types.find(t => t.account_type === account?.account_type)?.name}
                              </label>
                            </div>
                          </div>
                        }
                        { account_types.find(t => t.account_type === account?.account_type)?.account_type === 'Stocks' &&
                          <div className="relative z-0 w-full mb-6 group">
                            <Combobox stocks={stocks} getStock={getStock}/>
                          </div>
                        }
                        <div className="relative z-0 w-full mb-6 group">
                          <input 
                            type="text" 
                            name="institution"
                            id="institution" 
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                            required 
                            onChange={handleChange}
                          />
                          <label 
                            htmlFor="institution" 
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            {account_types.find(t => t.account_type === account?.account_type)?.institution}
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
                              onChange={handleChange}
                            />
                            <label 
                              htmlFor="amount" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:pink:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              {account_types.find(t => t.account_type === account?.account_type)?.amount}
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center justify-between">
                  <PinkBtn onClick={handleSubmit}>
                    Add
                  </PinkBtn>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}