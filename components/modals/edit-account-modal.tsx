import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/20/solid'
import { PinkBtn } from '../pink-btn'

export default function ({ getAccounts, showError, open, setOpen, user, account, setAccount, getNetWorth }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value })
  }

  const handleSubmit = async () => {
    const res = await fetch(`/api/update_account`, {
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
    getNetWorth()
  }

  const remove = async () => {
    fetch(`/api/remove_account`, {
      body: JSON.stringify({
        user_id: user.id,
        id: account.id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setOpen(false)
    getNetWorth()
    getAccounts()
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
                        Edit Account
                      </Dialog.Title>
                      <form onSubmit={handleSubmit}>
                        <div className="relative z-0 w-full mb-6 group">
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
                            readOnly
                            value={account?.name}
                            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                            required 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="relative z-0 w-full mb-6 group">
                          <label 
                            htmlFor="institution" 
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                          >
                            Institution
                          </label>
                          <input 
                            type="text" 
                            name="institution"
                            id="institution"
                            readOnly
                            value={account?.institution}
                            className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                            required 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                          <div className="relative z-0 w-full mb-6 group">
                            <label 
                              htmlFor="type" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Type
                            </label>
                            <input 
                              type="text" 
                              name="type" 
                              id="type"
                              readOnly
                              value={account?.type}
                              className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                              required
                              onChange={handleChange}
                            />
                          </div>
                          <div className="relative z-0 w-full mb-6 group">
                            <label 
                              htmlFor="subtype" 
                              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                            >
                              Subtype
                            </label>
                            <input 
                              type="text" 
                              name="subtype" 
                              id="subtype"
                              readOnly
                              value={account?.subtype}
                              className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                              required
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
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
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center">
                  <PinkBtn type="button" onClick={handleSubmit}>
                    Update
                  </PinkBtn>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  { !account.account_id &&
                    <button className="flex mx-auto" type="button" onClick={remove}>
                      <TrashIcon className="h-5 w-5 text-red-400 hidden lg:block" aria-hidden="true" />
                      <span className="flex lg:hidden text-sm text-red-400 font-semibold mt-4">Remove</span>
                    </button>
                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}