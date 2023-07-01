import { ArrowDownIcon, ArrowUpIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/20/solid'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const diff = (a, b) => {
  return  Math.round(100 * Math.abs(( a - b ) / ( (a+b)/2 )))
 }

export default function ({ totalStats, accounts }) {
  const { thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome } = totalStats
  const balance = accounts?.reduce((accumulator, currentValue) => accumulator + Number(currentValue.balances.current), 0)

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CreditCardIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">Current Balance</p>
        </dt>
        <dd className="ml-16 flex items-baseline">
          <p className={balance < 0 ? "text-2xl font-semibold text-green-600" : "text-2xl font-semibold text-red-600"}>
            ${Number(balance).toFixed(2)}
          </p>
        </dd>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">This Month's Total</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-red-600">
            ${Number(thisMonthTotal).toFixed(2)}
            <span className="ml-2 text-sm font-medium text-gray-500">from ${Number(lastMonthTotal).toFixed(2)}</span>
          </p>
          <p className={classNames(lastMonthTotal >= thisMonthTotal ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold')}>
            <ArrowUpIcon className={classNames(lastMonthTotal >= thisMonthTotal ? 'text-green-600' : 'text-red-600', 'h-5 w-5 flex-shrink-0 self-center text-green-500')} aria-hidden="true" />
            {diff(thisMonthTotal, lastMonthTotal)}%
          </p>
        </dd>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">Income</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-green-600">
            ${Number(Math.abs(thisMonthIncome)).toFixed(2)}
            <span className="ml-2 text-sm font-medium text-gray-500">from ${Number(Math.abs(lastMonthIncome)).toFixed(2)}</span>
          </p>
          <p className={classNames(lastMonthIncome >= thisMonthIncome ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold')}>
            {
              lastMonthIncome >= thisMonthIncome ?
              <ArrowDownIcon className='text-green-600 h-5 w-5 flex-shrink-0 self-center text-green-500' aria-hidden="true" />
              :
              <ArrowUpIcon className='text-red-600 h-5 w-5 flex-shrink-0 self-center text-green-500' aria-hidden="true" />
            }
            {diff(thisMonthIncome, lastMonthIncome)}%
          </p>
        </dd>
      </div>
    </dl>
  )
}
