import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma';
import { addComma, getAmount } from '../lib/formatNumber'
import AccountModal from '../components/account-modal'
import { Emoji } from 'emoji-picker-react'

const statuses = {
  depository: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  loan: 'text-red-700 bg-red-50 ring-red-600/10',
  credit: 'text-red-700 bg-red-50 ring-red-600/10',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const renderImg = (account) => {
  if(account.subtype === 'rental') return (<div className="my-1.5"><Emoji unified='1f3e0' size={35} /></div>)
  if(account.subtype === 'stocks') return (<div className="my-1.5"><Emoji unified='1f4c8' size={35} /></div>)
  if(account.institution === null) return (<div className="my-1.5"><Emoji unified='1f3e6' size={35} /></div>)

  return (
    <img
      src={`/assets/banks/${account.institution}.png`}
      alt={account.institution}
      className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
    />
  )
}

export default function ({ user, accounts, sum, showError }) {
  const [open, setOpen] = useState(false)
  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Net Worth</title>
      </Head>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl mb-6">Net Worth: {addComma(sum)}</h2>
      </div>
      <button onClick={() => setOpen(true)} className="absolute top-[50px] text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500 py-4">
        <p><span aria-hidden="true">+</span> Add Account</p>
      </button>
      <AccountModal showError={showError} open={open} setOpen={setOpen} user={user}/>
      <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
        {accounts.map((account) => Number(account._sum.amount) !== 0 && (
          <li key={account.id} className="overflow-hidden rounded-xl border border-gray-200 ">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 px-4 py-3">
              {renderImg(account)}
              <div className="leading-6 text-gray-900">
                <div className="text-lg font-bold">{account.institution}</div>
              </div>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Open options</span>
                  <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          View<span className="sr-only">, {account.name}</span>
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setOpen(true)}
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          Edit<span className="sr-only">, {account.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              {/* <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last invoice</dt>
                <dd className="text-gray-700">
                  <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
                </dd>
              </div> */}
              <div className="flex justify-between gap-x-4 py-3">
                <div className="font-medium text-gray-900">{addComma(account._sum.amount)}</div>
                <div
                  className={classNames(
                    statuses[account.subtype],
                    'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {account.subtype}
                </div>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </DashboardLayout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  // if(!session?.user) return { 
  //   redirect: {
  //     destination: '/auth/email-signin',
  //     permanent: false,
  //   },
  // }
  
  // @ts-ignore
  const { id, linked_user_id } = session?.user

  // @ts-ignore
  const accounts = await prisma.accounts.groupBy({
    by: ['institution', 'subtype'],
    where: {
      OR: [
        { user_id: id },
        { user_id: linked_user_id },
      ],
      active: true,
    },
    _sum: {
      // @ts-ignore
      amount: true,
    },
  })

  const sum = accounts.map(item => Number(item._sum.amount)).reduce((prev, next) => Number(prev) + Number(next))
  return {
    props: { user: session?.user, accounts: JSON.parse(JSON.stringify(accounts)), sum},
  }
}