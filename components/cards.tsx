export default function ({ accounts }) {
  return (
    <div>
      <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        { accounts?.length < 1 && <p className="text-gray-500"><b>No Cards Synced Yet</b></p>}
        { accounts?.map((account) => {
          let balanceClass = 'text-gray-400'
          if(account.balances.current > 0) balanceClass = 'text-red-600'
          if(account.balances.current < 0) balanceClass = 'text-green-600'
          return (
          <li key={account.name} className="col-span-1 flex rounded-md shadow-sm">
            <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <p className="font-medium text-gray-900 hover:text-gray-600">
                  {account.official_name}
                </p>
                <p className={balanceClass}><b>Balance:</b> ${account.balances.current}</p>
              </div>
            </div>
          </li>
        )})}
      </ul>
    </div>
  )
}
