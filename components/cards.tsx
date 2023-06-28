import { ArrowPathIcon, TrashIcon } from '@heroicons/react/20/solid'

export default function ({ accounts, getTransactions, removed, removeToken, loading }) {
  return (
    <div className="py-10">
      <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        { accounts?.length < 1 && <p className="text-gray-500"><b>No Cards Synced Yet</b></p>}
        { accounts?.map((account) => {
          let balanceClass = 'text-gray-400'
          if(account.balances.current > 0) balanceClass = 'text-red-600'
          if(account.balances.current < 0) balanceClass = 'text-green-600'
          return (
            <li key={account.name} className="col-span-1 flex rounded-md shadow-sm">
              <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <p className="font-medium text-gray-900 hover:text-gray-600">
                    {account.official_name.length > 30 ? `${account.official_name.substring(0, 46)}...` : account.official_name}
                  </p>
                  <p className={balanceClass}><b>Balance:</b> ${Math.abs(account.balances.current)}</p>
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
                  <div className={removed.access_token === account.access_token && removed.loading && 'hidden'}>
                    <button
                      onClick={() => removeToken(account.access_token)}
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Remove</span>
                      <TrashIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          )
        })} 
      </ul>
    </div>
  )
}
