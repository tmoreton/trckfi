import { Emoji } from 'emoji-picker-react';
import { commaShort } from '../lib/lodash'
import { DateTime } from "luxon"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const diff = (date) => {
  let today = DateTime.now()
  let upcoming = DateTime.fromISO(date)
  let difference = upcoming.diff(today, ['days']).toObject()
  return Math.round(difference.days)
}

export default function ({ recurring }) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 text-sm font-semibold text-gray-500">
        <div className="col-span-2">
          <p className="text-xl font-bold text-pink-600">Recurring Transactions</p>
        </div>
        <p className="hidden lg:block"><span className="text-xs pr-1 font-light italic">est.</span>Amount</p>
        <p className="col text-left hidden lg:block">Upcoming</p>
      </div>
      <hr className="my-4"/>
      <ul role="list">
        {recurring && recurring.map((r, eventIdx) => (
          <div key={eventIdx} className="grid grid-cols-3 lg:grid-cols-4 text-md text-gray-500 py-3">
            <div className="col-span-2 flex items-center">
              <Emoji unified={r.unified} size={22} />
              <span className="ml-4 font-semibold text-sm lg:text-base">{r.custom_name?.substring(0, 20) || r.merchant_name?.substring(0, 15) || r.name?.substring(0, 15)}</span>
            </div>

            <div className="hidden lg:block col-span-1">
              <p className={classNames(r.amount > 0 ? 'text-green-600' : 'text-red-600','font-bold')}>
                <span className="text-xs pr-1 font-light italic">≈</span>
                {commaShort(r.amount)}
              </p>
            </div>
            <div className="hidden lg:block col-span-1">
              <p className="text-left">
                <span className="text-xs pr-1 font-light italic">approx.</span>
                <b>{Math.abs(diff(r.upcoming_date))}</b> days
              </p>
            </div>

            <div className="block lg:hidden col-span-1 text-right">
              <p className={classNames(r.amount > 0 ? 'text-green-600' : 'text-red-600','font-bold')}>
                <span className="text-xs pr-1 font-light italic">≈</span>
                {commaShort(r.amount)}
              </p>
              <p className="text-xs"><b>{Math.abs(diff(r.upcoming_date))}</b> days</p>
            </div>
          </div>
        ))}
      </ul>
    </>
  )
}
