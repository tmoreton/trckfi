import { ArrowDownIcon, ArrowUpIcon, CalculatorIcon, CalendarDaysIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/20/solid'
import { DateTime } from "luxon";

export default function ({ transactions, accounts }) {
  const monthlySum = transactions.reduce((accumulator, currentValue) => accumulator + Number(currentValue.amount), 0)  
  const balance = accounts.reduce((accumulator, currentValue) => accumulator + Number(currentValue.balances.current), 0) 
  const startWeek = DateTime.local().setLocale('fr-CA').startOf('week').toISO()
  const startMonth = DateTime.local().setLocale('fr-CA').startOf('month').toISO()
  console.log(startMonth);

  return (
    <div className="py-4">
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-pink-600 p-3">
              <CreditCardIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Current Balance</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className={balance < 0 ? "text-2xl font-semibold text-green-600" : "text-2xl font-semibold text-red-600"}>${Number(balance).toFixed(2)}</p>
          </dd>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-white px-4 py-4 shadow sm:px-6 sm:pt-6">
          <dt>
            <div className="absolute rounded-md bg-pink-600 p-3">
              <CalendarDaysIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">This Month's Total</p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">${Number(monthlySum).toFixed(2)}</p>
            <p
              className={'text-green-600 ml-2 flex items-baseline text-sm font-semibold'}
            >
                <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
              <span className="sr-only"> Increased by </span>
              5.4%
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
            <p className="text-2xl font-semibold text-gray-900">${Number(monthlySum).toFixed(2)}</p>
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
    </div>
  )
}
