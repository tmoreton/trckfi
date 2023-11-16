import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { classNames } from '../../lib/lodash'
import { diffNum, commaShort } from '../../lib/lodash'

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ({ accounts, netWorth, history, totalStats }) {
  const { lastMonthString } = totalStats

  const this_month_net_worth = netWorth?.stats?.net_worth
  const last_month_net_worth = history?.reverse()[1]?.stats.net_worth
  return (
    <div className="mx-auto max-w-7xl p-6 rounded-md">
      <div className="border-b pb-6">
        <div className="flex justify-between items-center">
          <p className="hidden lg:block text-xl font-bold text-pink-600 pt-4">Accounts</p>
          <div className="block">
            <p className="truncate text-sm font-medium text-gray-500">Net Worth</p>
            <dd className="flex">
              {/* <ChartBarIcon className="h-12 w-12 text-pink-600 hidden" aria-hidden="true" /> */}
              <div className="items-baseline justify-between">
                <p className="text-2xl font-semibold text-green-600">{commaShort(this_month_net_worth || 0)}</p>
                <p className="text-xs text-gray-400">from <span className="font-bold">{commaShort(last_month_net_worth)}</span> in {lastMonthString}</p>
              </div>
              {/* <p className={classNames(Number(last_month_net_worth) <= Number(this_month_net_worth) ? 'text-green-600' : 'text-red-600', 'top-2.5 right-2.5 ml-2 flex items-baseline text-sm font-semibold')}>
                {
                  Number(last_month_net_worth) <= Number(this_month_net_worth) ?
                  <ArrowUpIcon className='text-green-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
                  :
                  <ArrowDownIcon className='text-red-600 h-5 w-5 flex-shrink-0 self-center' aria-hidden="true" />
                }
                {diffNum(this_month_net_worth, last_month_net_worth)}%
              </p> */}
            </dd>
          </div>
        </div>
        
      </div>
      <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <dl className="space-y-6 divide-y divide-gray-900/10">
        { accounts && Object.keys(accounts).map(key => {
          if(Object.keys(accounts)?.length > 0){
            const total = accounts[key].reduce((total, obj) => Number(obj.amount) + total, 0)
            return (
              <Disclosure as="div" key={key} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{capitalize(key.split('-')[0])}</span>
                        <span className="flex h-7 items-center text-left">
                          <span 
                            className={classNames(
                              total > 0
                                ? 'text-green-600'
                                : 'text-red-600',
                              'text-base font-semibold leading-7'
                            )}
                          >{commaShort(total)}</span>
                          {open ? (
                            <MinusSmallIcon className="ml-10 h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusSmallIcon className="ml-10 h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2">
                      { accounts[key].map((a, i) => (
                        <div key={accounts[key][i].id}>
                          <tr className="lg:text-sm text-xs text-gray-900 pt-1 flex justify-between">
                            <td className="text-left flex">
                              {a.name} 
                              {/* <span className="font-light hidden lg:inline-flex">{a.official_name}</span> */}
                            </td>
                            <td className="w-1/4 font-semibold text-left">{commaShort(a.amount)}</td> 
                          </tr>
                        </div>
                      ))}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            )
          }})}
        </dl>
      </div>
    </div>
  )
}