import { Emoji } from 'emoji-picker-react';
import { commaShort, classNames } from '../../lib/lodash'
import { DateTime } from "luxon"
import { PlusIcon } from '@heroicons/react/20/solid'

export default function ({ data, setEdit }) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      <button className="mb-4 inline-flex lg:hidden items-center rounded-full bg-pink-600 px-2 py-1 text-[15px] font-semibold text-white text-lg hover:bg-pink-500 justify-center w-[100%] lg:w-52"
        aria-label="Add Transaction" 
        onClick={() => setEdit({
          name: null,
          primary_category: null,
          detailed_category: null,
          amount: null,
          notes: null,
          unified: '1f50d',
          new: true
        })}>
        <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
        Add Transaction
      </button>
      {data && data?.map((t) => (
        <li onClick={() => setEdit(t)} key={t.id} className="flex justify-between gap-x-6 py-5">
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
              <time dateTime={t.date}>{DateTime.fromISO(t.date).toFormat('MMM dd')}</time>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
