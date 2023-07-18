import { Fragment, useState } from 'react'
import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma';
import { addComma, getAmount } from '../lib/formatNumber'
import AccountModal from '../components/account-modal'
import { Emoji } from 'emoji-picker-react'


const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}
const days = [
  {
    date: 'Today',
    dateTime: '2023-03-22',
    transactions: [
      {
        id: 1,
        invoiceNumber: '00012',
        href: '#',
        amount: '$7,600.00 USD',
        tax: '$500.00',
        status: 'Paid',
        client: 'Reform',
        description: 'Website redesign',
        icon: ArrowUpCircleIcon,
      },
      {
        id: 2,
        invoiceNumber: '00011',
        href: '#',
        amount: '$10,000.00 USD',
        status: 'Withdraw',
        client: 'Tom Cook',
        description: 'Salary',
        icon: ArrowDownCircleIcon,
      },
      {
        id: 3,
        invoiceNumber: '00009',
        href: '#',
        amount: '$2,000.00 USD',
        tax: '$130.00',
        status: 'Overdue',
        client: 'Tuple',
        description: 'Logo design',
        icon: ArrowPathIcon,
      },
    ],
  },
  {
    date: 'Yesterday',
    dateTime: '2023-03-21',
    transactions: [
      {
        id: 4,
        invoiceNumber: '00010',
        href: '#',
        amount: '$14,000.00 USD',
        tax: '$900.00',
        status: 'Paid',
        client: 'SavvyCal',
        description: 'Website redesign',
        icon: ArrowUpCircleIcon,
      },
    ],
  },
]

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

export default function ({ showError, user, stats, accts }) {
  const [open, setOpen] = useState(false)

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Net Worth</title>
      </Head>
      <AccountModal showError={showError} open={open} setOpen={setOpen} user={user}/>
      <main>
        <div className="relative isolate overflow-hidden">
          {/* Stats */}
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
              {stats.map((stat, statIdx) => (
                <div
                  key={stat.name}
                  className={classNames(
                    statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
                    'flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8'
                  )}
                >
                  <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
                  <dd
                    className={classNames(
                      stat.changeType === 'negative' ? 'text-rose-600' : 'text-gray-700',
                      'text-xs font-medium'
                    )}
                  >
                    {stat.change}
                  </dd>
                  <dd className={classNames(
                      stat.changeType === 'negative' ? 'text-rose-600' : 'text-gray-700',
                      'w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900'
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Recent activity table */}
        <div>
          <div className="overflow-hidden border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <table className="w-full text-left">
                  <thead className="sr-only">
                    <tr>
                      <th>Amount</th>
                      <th className="hidden sm:table-cell">Client</th>
                      <th>More details</th>
                    </tr>
                  </thead>
                  <tbody>
                  {accts.map((a) => (
                    <tr key={a.institution}>
                      <td className="relative py-4 pr-6">
                        <div className="flex gap-x-6">
                          <div className="w-20 flex items-center justify-between">
                            {renderImg(a)}
                          </div>
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <div className="text-md font-bold">
                                {a.name}
                              </div>
                            </div>
                            <div className="text-xs font-normal leading-6 text-gray-900">
                              {a.institution}
                            </div>
                            <div className="text-xs text-gray-400">
                              {a.subtype}
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                      <td className="hidden py-5 pr-6 sm:table-cell">
                        <div className="text-md leading-6 text-gray-900">{addComma(a._sum.amount)}</div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end">
                          <button className="text-sm font-medium leading-6 text-pink-600 hover:text-pink-500">
                            Edit
                          </button>
                        </div>
                        {/* <div className="mt-1 text-xs leading-5 text-gray-500">
                          Hello
                        </div> */}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  // @ts-ignore
  const { id, linked_user_id } = session?.user

  let linked_user = null
  if(linked_user_id){
    linked_user = await prisma.user.findUnique({
      where: { id: linked_user_id }
    })
  }
  const query = linked_user_id ? [{ user_id: id }, { user_id: linked_user_id }] : [{ user_id: id }]

  // @ts-ignore
  const accounts = await prisma.accounts.groupBy({
    by: ['type', 'subtype', 'institution', 'name'],
    where: {
      OR: query,
      amount: {
        not: 0
      },
      active: true,
    },
    _sum: {
      // @ts-ignore
      amount: true,
    },
    orderBy: {
      subtype: 'asc',
    },
  })

  let total_assets = 0
  let total_liabilities = 0
  accounts.forEach(a => {
    if(a.type === 'loan' || a.type === 'credit'){
      total_liabilities -= Number(a._sum.amount)
    } else {
      total_assets += Number(a._sum.amount)
    }
  });
  const stats = [
    { name: 'Net Worth', value: addComma(total_assets-total_liabilities), change: '+0%', changeType: 'nuetral' },
    { name: 'Assets', value: addComma(total_assets), change: '+0%', changeType: 'positive' },
    { name: 'Liabilities', value: addComma(total_liabilities), change: '+0%', changeType: 'negative' },
  ]
  return {
    props: { user: session?.user, accounts: JSON.parse(JSON.stringify(accounts)), stats, accts: JSON.parse(JSON.stringify(accounts))},
  }
}