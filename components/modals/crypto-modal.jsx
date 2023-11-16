import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { PinkBtn } from '../pink-btn'
import Dropdown from '../dropdown'
import { commaShort } from '../../lib/lodash'

export default function ({ showError, open, setOpen, user, getNetWorth }) {
  const [stocks, setCoins] = useState([])
  const [query, setQuery] = useState(null)
  const [selected, setSelected] = useState(null)
  const [account, setAccount] = useState({})

  useEffect(() => {
    if(query?.length >= 3){
      searchCrypto(query)
    }
  }, [query])

  const onClose = () => {
    setOpen(false)
    setCoins([])
    setQuery(null)
    setSelected(null)
    setAccount({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount({ ...account, [name]: value })
  }

  const updateQuantity = (e) => {
    const { value, name } = e.target
    let total = Number(value) * Number(account?.current_price)
    setAccount({ ...account, amount: total.toFixed(2),[name]: Number(value)})
  }
  
  const searchCrypto = async (search) => {
    const res = await fetch(`/api/search_crypto`, {
      body: JSON.stringify({ search }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setCoins(data)
  }

  const getCrypto = async (selected) => {
    setSelected(selected)
    const res = await fetch(`/api/get_crypto_price`, {
      body: JSON.stringify({ id: selected.id }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setAccount({
      name: data.name,
      institution: 'Crypto',
      type: 'investment',
      subtype: 'crypto',
      amount: null,
      current_price: data.current_price,
      symbol: data.symbol,
      quantity: null,
      image: data.image,
      crypto_id: selected.id
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!account?.quantity || account?.quantity <= 0){
      showError('Please add quantity')
    } else {
      const res = await fetch(`/api/add_account`, {
        body: JSON.stringify({
          user_id: user.id,
          name: account.name,
          official_name: account.symbol.toUpperCase(),
          institution: 'Crypto',
          type: 'investment',
          subtype: account.subtype,
          amount: account.amount,
          details: {
            current_price: account?.current_price,
            symbol: account?.symbol.toUpperCase(),
            quantity: account?.quantity,
            image: account?.image,
            id: account?.crypto_id
          }
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const { error } = await res.json()
      showError(error)
      setOpen(false)
      if(!error) getNetWorth()
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="w-full">
                    <div className="mt-3 sm:mt-0">
                      <Dialog.Title as="h3" className="text-center text-base font-semibold leading-6 text-gray-900 mb-4 flex justify-center">
                        Add Cryptocurrency
                      </Dialog.Title>
                      <div className="relative z-0 w-full mb-6 group">
                        <Dropdown values={stocks} selected={selected} setSelected={getCrypto} onChange={setQuery} />
                      </div>
                      {
                        selected &&
                        <form onSubmit={handleSubmit}>
                          <div className="grid md:grid-cols-2 md:gap-6">
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
                                className="block py-2.5 px-0 w-full font-bold text-sm text-gray-500 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer"
                                required 
                                onChange={handleChange}
                              />
                            </div>
                            <div className="relative z-0 w-full mb-6 group">
                              <label 
                                htmlFor="current_price" 
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Current Price
                              </label>
                              <input 
                                type="text" 
                                name="current_price" 
                                id="current_price"
                                readOnly
                                value={account?.current_price}
                                className="hidden py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer"
                              />
                              <p className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer">
                                {commaShort(account?.current_price)}
                              </p>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6 hidden">
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
                                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer"
                                onChange={handleChange}
                              />
                            </div>
                            <div className="relative z-0 w-full mb-6 group hidden">
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
                                value={account?.subtype}
                                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer"
                                required
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">

                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-6 group">
                              <label 
                                htmlFor="quantity" 
                                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                              >
                                Quantity
                              </label>
                              <input 
                                type="number" 
                                name="quantity" 
                                id="quantity"
                                value={account?.quantity}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer"
                                required
                                onChange={updateQuantity}
                              />
                            </div>
                            {
                              account?.amount &&
                              <div className="relative z-0 w-full mb-6 group">
                                <label 
                                  htmlFor="amount" 
                                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-pink-600 peer-focus:dark:text-pink-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                  Total Value
                                </label>
                                <input 
                                  type="text" 
                                  name="amount" 
                                  id="amount"
                                  readOnly
                                  value={account?.amount}
                                  className="hidden py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer"
                                />
                                <p className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 font-bold appearance-none focus:outline-none focus:ring-0 peer">
                                  {commaShort(account?.amount)}
                                </p>
                              </div>
                            }
                          </div>
                          <div className="sm:flex sm:flex-row-reverse items-center justify-between">
                            <PinkBtn type="submit">
                              Add
                            </PinkBtn>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={onClose}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
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