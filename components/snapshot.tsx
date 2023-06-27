import { ArrowDownIcon, ArrowUpIcon, CalculatorIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/20/solid'
import { DateTime } from "luxon";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const diff = (a, b) => {
  return  Math.round(100 * Math.abs(( a - b ) / ( (a+b)/2 )))
 }

export default function ({ thisMonth, lastMonth, thisWeek, lastWeek, accounts }) {
  const date = DateTime.local()
  const thisMonthSum = thisMonth.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  const balance = accounts.reduce((accumulator, currentValue) => accumulator + Number(currentValue.balances.current), 0)
  const lastMonthSum = lastMonth.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)
  const thisWeekSum = thisWeek.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow sm:px-6 sm:pt-6">


        {/* <div className="px-4 py-5 sm:p-6">
          <dt className="text-base font-normal text-gray-900">This Month's Total</dt>
          <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-gray-800">
              ${Number(thisMonthSum).toFixed(2)}
              <span className="ml-2 text-sm font-medium text-gray-500">from ${Number(lastMonthSum).toFixed(2)}</span>
            </div>

            <div
              className={classNames(
                lastMonthSum >= thisMonthSum ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0'
              )}
            >
              {lastMonthSum >= thisMonthSum ? (
                <ArrowUpIcon
                  className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownIcon
                  className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                  aria-hidden="true"
                />
              )}
              <span className="sr-only"> {lastMonthSum >= thisMonthSum ? 'Increased' : 'Decreased'} by </span>
              {diff(thisMonthSum, lastMonthSum)}%
            </div>
          </dd>
        </div> */}


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

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow sm:px-6 sm:pt-6">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">This Month's Total</p>
        </dt>
        <dd className="ml-16 flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-gray-900">
            ${Number(thisMonthSum).toFixed(2)}
            <span className="ml-2 text-sm font-medium text-gray-500">from ${Number(lastMonthSum).toFixed(2)}</span>
          </p>
          <p className={classNames(lastMonthSum >= thisMonthSum ? 'text-green-600' : 'text-red-600', 'ml-2 flex items-baseline text-sm font-semibold')}>
            <ArrowUpIcon className={classNames(lastMonthSum >= thisMonthSum ? 'text-green-600' : 'text-red-600', 'h-5 w-5 flex-shrink-0 self-center text-green-500')} aria-hidden="true" />
            {diff(thisMonthSum, lastMonthSum)}%
          </p>
        </dd>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow sm:px-6 sm:pt-6">
        <dt>
          <div className="absolute rounded-md bg-pink-600 p-3">
            <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <p className="ml-16 truncate text-sm font-medium text-gray-500">This Week's Total</p>
        </dt>
        <dd className="ml-16 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">${Number(thisWeekSum).toFixed(2)}</p>
          <p
            className={'text-green-600 ml-2 flex items-baseline text-sm font-semibold'}
          >
              <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
            <span className="sr-only"> Increased by </span>
            5.4%
          </p>
        </dd>
      </div>
    </dl>
  )
}
