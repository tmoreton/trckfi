import { commaShort } from '../lib/lodash'
import { DateTime } from "luxon"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ({ payments }) {

  const renderImg = (account) => {
    if(account){
      let image_url = `/assets/banks/${account.institution}.png`
      return <img
        src={image_url}
        alt={account.institution}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src="/assets/banks/bank.png";
        }}
        className="h-6 w-6 flex-none rounded-md object-cover"
      />
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 lg:grid-cols-5 text-sm font-semibold text-gray-500 flex">
        <div className="col-span-3">
          <p className="text-xl font-bold text-pink-600">Bill Payments</p>
        </div>
        <p className="hidden lg:block">Balance</p>
        <p className="col text-left hidden lg:block"><span className="text-xs pr-1 font-light italic">est.</span>Due Date</p>
      </div>
      <hr className="my-4"/>
      {payments && payments.map((r, eventIdx) => (
        <div key={eventIdx} className="grid grid-cols-4 lg:grid-cols-5 text-md text-gray-500 py-3">
          <div className="col-span-3 flex items-center">
            {renderImg(r?.account)}
            <div>
            <p className="ml-4 text-xs font-bold">{r?.account?.name}</p>
            <p className="ml-4 text-xs">{r?.account?.official_name}</p>
            </div>
          </div>
          <div className="hidden lg:block col-span-1">
            <p className={classNames(r.account.amount > 0 ? 'text-green-600': 'text-red-600','font-bold')}>
              {commaShort(r.account.amount)}
            </p>
          </div>
          <div className="hidden lg:block col-span-1">
            <p className="text-left"><b>{DateTime.fromISO(r.date).plus({ months: 1 }).toFormat('MMM dd')}</b></p>
          </div>

          <div className="block lg:hidden col-span-1 text-right">
            <p className={classNames(r.account.amount > 0 ? 'text-green-600': 'text-red-600','font-bold')}>
              {commaShort(r.account.amount)}
            </p>
            <p className="text-xs"><b>{DateTime.fromISO(r.date).plus({ months: 1 }).toFormat('MMM dd')}</b></p>
          </div>
        </div>
      ))}
    </>
  )
}
