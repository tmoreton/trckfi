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
      <div className="grid grid-cols-4 text-sm font-semibold text-gray-500">
        <div className="col-span-2">
          <p className="text-xl font-bold text-pink-600">Recurring Transactions</p>
        </div>
        <div><span className="text-xs pr-1 font-light italic">est.</span>Amount</div>
        <div className="col text-left">Upcoming</div>
      </div>
      <hr className="my-4"/>
      <ul role="list">
        {recurring && recurring.map((r, eventIdx) => (
          <div key={eventIdx} className="grid grid-cols-4 text-md text-gray-500 py-3">
            <div className="col-span-2 flex">
              <Emoji unified={r.unified} size={22} />
              <span className="ml-4">{r.custom_name?.substring(0, 20) || r.merchant_name?.substring(0, 15) || r.name?.substring(0, 15)}</span>
            </div>
            <div className={classNames(
              r.amount > 0
                ? 'text-green-600'
                : 'text-red-600',
              'font-bold col-span-1'
            )}><span className="text-xs pr-1 font-light italic">≈</span>{commaShort(r.amount)}</div>
            <div className="col-span-1 text-left"><span className="text-xs pr-1 font-light italic">approx.</span><b>{diff(r.upcoming_date)}</b> days</div>
          </div>
        ))}
      </ul>
    </>
  )
}
