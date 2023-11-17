import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PinkBtn } from '../pink-btn'

const subtypes = [
  { subtype: 'mortgage', type: 'loan'},
  { subtype: 'credit card', type: 'credit'},
  { subtype: 'savings', type: 'depository'},
  { subtype: 'checking', type: 'depository'},
  { subtype: 'brokerage', type: 'investment'},
  { subtype: 'ira', type: 'investment'},
  { subtype: '401k', type: 'investment'},
  { subtype: 'auto loan', type: 'loan'},
  { subtype: 'line of credit', type: 'loan'},
  { subtype: 'student loan', type: 'loan'},
]

export default function ({ showError, open, setOpen, user, getNetWorth }) {
  const [account, setAccount] = useState({
    subtype: 'mortgage', type: 'loan'
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/add_account`, {
      body: JSON.stringify({
        user_id: user.id,
        name: account.name,
        official_name: account.name,
        institution: account.institution,
        type: account.type,
        subtype: account.subtype,
        amount: account.amount.replace(/[, ]+/g, "").trim()
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    setAccount({ subtype: 'mortgage', type: 'loan' })
    showError(error)
    setOpen(false)
    if(!error) getNetWorth()
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
          <div className="block lg:flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="mt-3 sm:mt-0">
                      <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900 mb-4 flex justify-center">
                        Add Account Manually
                      </Dialog.Title>
                      <form onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-8 group">
                          <label 
                            htmlFor="subtype" 
                            className="peer-focus:font-medium text-xs text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Type
                          </label>
                          <select
                            id="subtype"
                            name="subtype"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-pink-600 sm:text-sm sm:leading-6"
                            onChange={e => setAccount({ ...account, type: JSON.parse(e.target.value).type, subtype: JSON.parse(e.target.value).subtype })}
                          >
                            { subtypes.map(t => <option value={JSON.stringify(t)} label={t.subtype}/>) }
                          </select>
                        </div>
                        <div className="relative z-0 w-full mb-8 group">
                          <label 
                            htmlFor="name" 
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Name
                          </label>
                          <input 
                            type="text" 
                            name="name"
                            id="name" 
                            value={account?.name}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                            required 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                          <div className="relative z-0 w-full mb-6 group">
                            <label 
                              htmlFor="institution" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Bank/Institution
                            </label>
                            <input 
                              type="text" 
                              name="institution"
                              id="institution" 
                              value={account?.institution}
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                              onChange={handleChange}
                            />
                          </div>
                          <div className="relative z-0 w-full mb-6 group">
                            <label 
                              htmlFor="amount" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Amount
                            </label>
                            <input 
                              type="text" 
                              name="amount" 
                              id="amount"
                              value={account?.amount}
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                              required
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="sm:flex sm:flex-row-reverse items-center justify-between">
                          <PinkBtn type="submit">
                            Add
                          </PinkBtn>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
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