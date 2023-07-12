import { useState } from 'react'
import { ArrowPathIcon, TrashIcon } from '@heroicons/react/20/solid'
import RemoveAccount from "./remove-account"
import { addComma, diffNum } from '../lib/formatNumber'

export default function ({ getTransactions, getDashboard, loading, accounts, showAccounts, showError }) {
  const [open, setOpen] = useState(false)
  const [removedAccounts, setAccounts] = useState([])
  const [token, setToken] = useState('')

  const getAccounts = async (access_token) => {
    setToken(access_token)
    setOpen(true)
    const items = accounts.filter(item => item.access_token.indexOf(access_token) !== -1);
    setAccounts(items)
  }

  const removeToken = async (all) => {
    const res = await fetch(`/api/remove_access_token`, {
      body: JSON.stringify({
        access_token: token,
        all
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    getDashboard()
    setOpen(false)
  }

  return (
    <div className={!showAccounts && 'hidden'}>
      <div className="py-4 border-t-2">
        <RemoveAccount open={open} setOpen={setOpen} removeToken={removeToken} accounts={removedAccounts} />
        <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          { accounts?.length < 1 && <p className="text-gray-500"><b>No Cards Synced Yet</b></p>}
          { accounts?.map((account) => {
            let balanceClass = 'text-gray-600 text-base'
            if(account.type === 'credit' || account.type === 'loan') balanceClass = 'text-red-600 text-base'
            if(account.type === 'depository' || account.type === 'investment') balanceClass = 'text-green-600 text-base'
            if(account.balances.current === 0) balanceClass = 'text-gray-600 text-base'
            return (
              <li key={account.name} className="col-span-1 flex rounded-md shadow-sm">
                <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
                  <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p className={balanceClass}><b>Balance:</b> {addComma(account.balances.current)}</p>

                    <p className="text-xs text-gray-900 hover:text-gray-600 mb-1">
                      {account.official_name?.length > 30 ? `${account.official_name?.substring(0, 40)}...` : account.official_name}
                    </p>
                    <p className="text-xs text-gray-900 hover:text-gray-600">
                      {account.name?.length > 30 ? `${account.name?.substring(0, 40)}...` : account.name}
                      {/* <span className="text-xs text-gray-400 ml-2">{account.subtype}</span> */}
                    </p>
                  </div>
                  <div className="p-2 mt-6 flex">
                    <div className={loading.access_token === account.access_token && loading.loading && "animate-spin"}>
                      <button
                        onClick={() => getTransactions(account.access_token)}
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Refresh</span>
                        <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      onClick={() => getAccounts(account.access_token)}
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Remove</span>
                      <TrashIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })} 
        </ul>
      </div>
    </div>
  )
}
