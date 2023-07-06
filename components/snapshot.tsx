import { ArrowDownIcon, ArrowUpIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const diff = (a, b) => {
  return  Math.round(100 * Math.abs(( a - b ) / ( (a+b)/2 )))
 }

export default function ({ totalStats, accounts, setShowAccounts, showAccounts }) {
  if (!totalStats || !accounts) return null
  
  const { thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome, thisMonthString, lastMonthString } = totalStats
  let balance = 0
  accounts.forEach(e => {
    if(e.type === 'credit'){
      balance -= Number(e.balances.current)
    } else {
      balance += Number(e.balances.current)
    }
  });

  return (
    <dl className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CreditCardIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">Current Account Balance</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <p className={balance >= 0 ? "text-2xl font-semibold text-green-600" : "text-2xl font-semibold text-red-600"}>
            ${Number(balance).toFixed(2)}
          </p>
          {
            showAccounts ?
            <button onClick={() => setShowAccounts(false)} className="inline-flex">
              <p className="font-bold text-xs text-pink-600">Hide Accounts</p>
              <ChevronDownIcon className="font-bold h-5 w-5 text-pink-600" />
            </button>
            :
            <button onClick={() => setShowAccounts(true)} className="inline-flex">
              <p className="font-bold text-xs text-pink-600">Show Accounts</p>
              <ChevronUpIcon className="font-bold h-5 w-5 text-pink-600" />
            </button>
          }
        </dd>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Expenses</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-red-600">${Number(thisMonthTotal).toFixed(2)}</p>
            <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">${Number(lastMonthTotal).toFixed(2)}</span> in {lastMonthString}</p>
          </div>
          <p className={classNames(Number(lastMonthTotal) >= Number(thisMonthTotal) ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold')}>
            <ArrowUpIcon className={classNames(Number(lastMonthTotal) >= Number(thisMonthTotal) ? 'text-green-600' : 'text-red-600', 'h-5 w-5 flex-shrink-0 self-center text-green-500')} aria-hidden="true" />
            {diff(Number(thisMonthTotal), Number(lastMonthTotal))}%
          </p>
        </dd>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Income</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-semibold text-green-600">${Number(Math.abs(thisMonthIncome)).toFixed(2)}</p>
            <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">${Number(Math.abs(lastMonthIncome)).toFixed(2)}</span> in {lastMonthString}</p>
          </div>
          <p className={classNames(Number(thisMonthIncome) >= Number(lastMonthIncome) ? 'text-red-600' : 'text-green-600', 'ml-2 flex items-baseline text-sm font-semibold')}>
            {
               Number(thisMonthIncome) >= Number(lastMonthIncome) ?
              <ArrowDownIcon className='text-red-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
              :
              <ArrowUpIcon className='text-green-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
            }
            {diff(Number(thisMonthIncome), Number(lastMonthIncome))}%
          </p>
        </dd>
      </div>
    </dl>
  )
}
