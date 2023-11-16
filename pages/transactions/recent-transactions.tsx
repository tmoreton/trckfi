import { Emoji } from 'emoji-picker-react';
import { commaShort, classNames } from '../../lib/lodash'
import { DateTime } from "luxon"

export default function ({ data }) {
  return (
    <div>
      <p className="text-2xl font-bold text-pink-600 border-b pb-4 mb-4 text-center">Recent Transactions</p>
      <ul role="list" className="divide-y divide-gray-100">
        {data.map((t) => (
          <li key={t.id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4 items-center">
              <Emoji unified={t?.unified} size={20} />
              <div className="min-w-0 flex-auto">
                <p className="text-md font-semibold leading-6 text-gray-900 truncate">{t.custom_name || t.merchant_name || t.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{t.account.name}</p>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className={classNames(Math.trunc(t.amount) > 0 ? "text-green-600" : "text-red-600", "text-md font-semibold leading-6 text-gray-900 text-right")}>
                {commaShort(t.amount)} 
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500 text-right">
                <time dateTime={t.date}>{DateTime.fromISO(t.date).plus({ months: 1 }).toFormat('MMM dd')}</time>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
