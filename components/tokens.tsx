import { ArrowPathIcon, TrashIcon } from '@heroicons/react/20/solid'

export default function ({ getTransactions, tokens, removeToken, loading }) {
  return (
    <div>
      <ul role="list" className="ml-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {tokens.map((t) => (
          <li key={t.id} className="col-span-1 flex rounded-md shadow-sm">
            <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <p className="font-medium text-gray-900 hover:text-gray-600">
                  {t.item_id}
                </p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <div className={loading.access_token === t.access_token && loading.loading && "animate-spin"}>
                  <button
                    onClick={() => getTransactions(t.access_token)}
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Refresh</span>
                    <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  onClick={() => removeToken(t.access_token)}
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Remove</span>
                  <TrashIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
