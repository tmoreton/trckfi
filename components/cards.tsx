import { ArrowPathIcon } from '@heroicons/react/20/solid'

export default function ({ accounts, getTransactions }) {
  return (
    <div>
      <ul role="list" className="ml-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {accounts.map((account) => (
          <li key={account.name} className="col-span-1 flex rounded-md shadow-sm">
            <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <p className="font-medium text-gray-900 hover:text-gray-600">
                  {account.name}
                </p>
                <p className="text-gray-500"><b>Balance:</b> ${account.balances.current}</p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <form onSubmit={getTransactions}>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
