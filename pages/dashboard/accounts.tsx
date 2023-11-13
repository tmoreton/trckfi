import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import { commaShort } from '../../lib/lodash'
import { classNames } from '../../lib/lodash'

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ({ accounts }) {
  return (
    <div className="mx-auto max-w-7xl py-6 px-10 rounded-md">
      <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <p className="text-xl font-bold text-pink-600">Accounts</p>
        <dl className="mt-4 space-y-6 divide-y divide-gray-900/10">
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