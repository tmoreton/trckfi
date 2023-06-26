export default function ({ accounts }) {
  return (
    <div>
      <ul role="list" className="ml-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        { accounts?.length < 1 && <p className="text-gray-500"><b>No Cards Synced Yet</b></p>}
        { accounts?.map((account) => (
          <li key={account.name} className="col-span-1 flex rounded-md shadow-sm">
            <div className="flex flex-1 items-center justify-between truncate rounded-md border-b border border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <p className="font-medium text-gray-900 hover:text-gray-600">
                  {account.name}
                </p>
                <p className="text-gray-500"><b>Balance:</b> ${account.balances.current}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
