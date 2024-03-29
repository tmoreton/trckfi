import { ArrowDownIcon, ArrowUpIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon, ChartBarIcon, BanknotesIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid'
import { diffNum, commaShort } from '../../lib/lodash'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export default function ({ totalStats }) {
  if (!totalStats) return null
  const { thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome, thisMonthString, lastMonthString } = totalStats
  let this_month_savings = Number(thisMonthIncome) - Number(-thisMonthTotal)
  return (
    <>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="savings-step relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 rounded-md border-b border border-gray-200">
          <dt>
            <div className="absolute pt-3">
              <BanknotesIcon className="h-12 w-12 text-pink-600" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Savings Rate</p>
          </dt>
          <dd className="ml-16 flex items-baseline justify-between">
            {
              !thisMonthTotal || !thisMonthIncome || thisMonthIncome-(-thisMonthTotal) <= 0 ?
              <div className="items-baseline justify-between">
                <p className="text-2xl font-semibold text-red-600">0%</p>
                <p className="text-xs text-gray-400 truncate">You spent <span className="font-bold text-red-600">{commaShort(this_month_savings)}</span> more than you made 😕</p>
              </div>
              :
              <div className="items-baseline justify-between">
                <p className="text-2xl font-semibold text-green-600">{Math.round(this_month_savings/thisMonthIncome*100)}%</p>
                <p className="text-xs text-gray-400">You saved <span className="font-bold text-green-600">{commaShort(this_month_savings || 0)}</span> so far this month! 🎉</p>
              </div>
            }
          </dd>
        </div>
        {/* <div className="savings-step relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-4 rounded-md border-b border border-gray-200">
          <dt>
            <div className="absolute pt-3">
              <CurrencyDollarIcon className="h-12 w-12 text-pink-600" aria-hidden="true" />
            </div>
          </dt>
          <dd className="ml-16 flex items-baseline justify-between">
              <div>
                <p className="text-sm pb-1.5 text-gray-500">Current Balance: <span className="text-red-600 font-semibold text-md">{accountBalance?.current && commaShort(accountBalance?.current)}</span></p>
                <p className="text-sm pb-1.5 text-gray-500">Available Credit: <span className="text-green-600 font-semibold text-md">{accountBalance?.available && commaShort(accountBalance?.available)}</span></p>
                <p className="text-sm text-gray-500">Credit Limit: <span className="text-red-600 font-semibold text-md">{accountBalance?.limit && commaShort(accountBalance?.limit)}</span></p>
              </div>
          </dd>
        </div> */}
        <div className="expenses-step relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
          <dt>
            <div className="absolute rounded-md bg-pink-600 p-3">
              <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Expenses</p>
          </dt>
          <dd className="ml-16 flex items-baseline justify-between">
            <div className="items-baseline justify-between">
              <p className="text-2xl font-semibold text-red-600">{commaShort(thisMonthTotal || 0)}</p>
              <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">{commaShort(lastMonthTotal)}</span> in {lastMonthString}</p>
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

        <div className="income-step relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow-sm sm:px-6 sm:pt-6 rounded-md border-b border border-gray-200">
          <dt>
            <div className="absolute rounded-md bg-pink-600 p-3">
              <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">{thisMonthString} Income</p>
          </dt>
          <dd className="ml-16 flex items-baseline justify-between">
            <div className="items-baseline justify-between">
              <p className="text-2xl font-semibold text-green-600">{commaShort(thisMonthIncome || 0)}</p>
              <p className="ml-2 text-xs text-gray-400">from <span className="font-bold">{commaShort(lastMonthIncome || 0)}</span> in {lastMonthString}</p>
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
    </>
  )
}
