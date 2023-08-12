import { ArrowDownIcon, ArrowUpIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon, ArrowPathIcon } from '@heroicons/react/20/solid'
import { addComma, diffNum } from '../lib/lodash'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function ({ totalStats, refresh, loading }) {
  if (!totalStats) return null
  
  const { thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome, thisMonthString, lastMonthString } = totalStats
  let this_month_savings = Number(thisMonthIncome) - Number(-thisMonthTotal)
  let last_month_savings = Number(lastMonthIncome) - Number(-lastMonthTotal)
  return (
    <dl className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CreditCardIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Savings Rate</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <div className="items-baseline justify-between">
            <p className="text-2xl font-semibold text-red-600">{`${thisMonthTotal/thisMonthIncome || 0}%`}</p>
            <p className="ml-2 text-xs text-gray-400 font-bold">{addComma(this_month_savings || 0)}</p>
          </div>
          <div className={loading && "animate-spin"}>
            <button
              onClick={refresh}
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Refresh</span>
              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
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
          <div className="items-baseline justify-between">
            <p className="text-2xl font-semibold text-red-600">{addComma(thisMonthTotal || 0)}</p>
            <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">{addComma(lastMonthTotal)}</span> in {lastMonthString}</p>
          </div>
          <p className={classNames(Number(lastMonthTotal) <= Number(thisMonthTotal) ? 'text-green-600' : 'text-red-600', 'absolute top-2.5 right-2.5 ml-2 flex items-baseline text-sm font-semibold')}>
            {
               Number(lastMonthTotal) <= Number(thisMonthTotal) ?
              <ArrowDownIcon className='text-green-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
              :
              <ArrowUpIcon className='text-red-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
            }
            {diffNum(thisMonthTotal, lastMonthTotal)}%
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
          <div className="items-baseline justify-between">
            <p className="text-2xl font-semibold text-green-600">{addComma(thisMonthIncome || 0)}</p>
            <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">{addComma(lastMonthIncome || 0)}</span> in {lastMonthString}</p>
          </div>
          <p className={classNames(Number(thisMonthIncome) <= Number(lastMonthIncome) ? 'text-red-600' : 'text-green-600', 'absolute top-2.5 right-2.5 ml-2 flex items-baseline text-sm font-semibold')}>
            {
               Number(thisMonthIncome) <= Number(lastMonthIncome) ?
              <ArrowDownIcon className='text-red-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
              :
              <ArrowUpIcon className='text-green-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
            }
            {diffNum(thisMonthIncome, lastMonthIncome)}%
          </p>
        </dd>
      </div>
    </dl>
  )
}
