import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import Head from 'next/head'
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import { addComma } from '../lib/formatNumber'
import HomeModal from '../components/modals/home-modal'
import HideAccountModal from '../components/modals/hide-account-modal'
import EditAccountModal from '../components/modals/edit-account-modal'
import ManualModal from '../components/modals/add-manually-modal'
import StockModal from '../components/modals/stock-modal'
import CryptoModal from '../components/modals/crypto-modal'
import { Emoji } from 'emoji-picker-react'
import PlaidLink from '../components/plaid-link';
import { DateTime } from "luxon"
import { useSession } from "next-auth/react"
import { useLocalStorage, clearLocalStorage } from "../utils/useLocalStorage"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const renderImg = (account) => {
  if(account.subtype === 'rental' || account.subtype === 'home') return (<div className="my-1.5"><Emoji unified='1f3e0' size={35} /></div>)
  if(account.subtype === 'equity') return (<div className="my-1.5"><Emoji unified='1f4c8' size={35} /></div>)
  if(account.subtype === 'crypto') return (<img src={account.details?.image} alt={account.institution} className="h-12 w-12 flex-none rounded-lg bg-white object-cover"/>)
  if(account.institution === null) return (<div className="my-1.5"><Emoji unified='1f3e6' size={35} /></div>)
  let image_url = `/assets/banks/${account.institution}.png`
  return <img 
    src={image_url} 
    onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      currentTarget.src="/assets/banks/bank.png";
    }}
    className="h-12 w-12 flex-none rounded-md object-cover"
  />
}

const NetWorth = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [openHome, setOpenHome] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openStock, setOpenStock] = useState(false)
  const [openCrypto, setOpenCrypto] = useState(false)
  const [openManually, setOpenManually] = useState(false)
  const [account, setAccount] = useState({})
  const [stats, setStats] = useLocalStorage('net_worth_stats', [])
  const [accounts, setAccounts] = useLocalStorage('net_worth_accounts', [])

  useEffect(() => {
    if(accounts.length <= 0){
      getNetWorth()
    }
  }, [user])

  const editAccount = (a) => {
    setAccount(a)
    setOpenEdit(true)
  }

  const removeAccount = (a) => {
    setAccount(a)
    setOpen(true)
  }

  const getNetWorth = async () => {
    setLoading(true)
    const res = await fetch(`/api/get_net_worth`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    if(error){
      showError(error)
    } else {
      setStats(data.net_worth_stats)
      setAccounts(data.accounts)
    }
    setLoading(false)
  }

  const refresh = async () => {
    clearLocalStorage()
    setLoading(true)
    fetch(`/api/update_crypto_price`, {
      body: JSON.stringify({
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    fetch(`/api/update_stock_price`, {
      body: JSON.stringify({
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const res = await fetch(`/api/sync_accounts`, {
      body: JSON.stringify({
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setLoading(false)
    const { error } = await res.json()
    showError(error)
    if(!error) getNetWorth()
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Net Worth</title>
      </Head>
      <EditAccountModal showError={showError} open={openEdit} setOpen={setOpenEdit} user={user} account={account} setAccount={setAccount}/>
      <StockModal showError={showError} open={openStock} setOpen={setOpenStock} user={user}/>
      <CryptoModal showError={showError} open={openCrypto} setOpen={setOpenCrypto} user={user}/>
      <HomeModal showError={showError} open={openHome} setOpen={setOpenHome} user={user}/>
      <ManualModal showError={showError} open={openManually} setOpen={setOpenManually} user={user}/>
      <HideAccountModal showError={showError} open={open} setOpen={setOpen} user={user} account={account}/>
      
      <div className="flex justify-center space-x-6 mb-4">
        <button onClick={() => setOpenStock(true)} className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          Add Stock
        </button>
        <button onClick={() => setOpenHome(true)} className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          Add Home Value
        </button>
        <button  onClick={() => setOpenCrypto(true)} className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          Add Crypto
        </button>
        <PlaidLink user={user} showError={showError} />
        <button  onClick={() => setOpenManually(true)} className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          Add Manually
        </button>
        <div className={loading && "animate-spin"}>
          <button
            onClick={refresh}
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Refresh</span>
            <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <main>
        <div className="relative isolate overflow-hidden">
          {/* Stats */}
          <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
            <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
              {stats.map((stat, statIdx) => (
                <div
                  key={statIdx}
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
                  {accounts.map((a) => (
                    <tr key={a.id}>
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
                        <div className="text-md font-bold leading-6 text-gray-900">{addComma(a.amount)}</div>
                        <div className="mt-1 text-xs leading-5 text-gray-500 font-semibold">
                        Last Updated:
                        </div>
                        <div className="text-xs text-gray-400">
                          {DateTime.fromISO(a.updated_at).toLocaleString(DateTime.DATETIME_SHORT)}
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end">
                          <button onClick={() => editAccount(a)} className="text-sm font-medium leading-6 text-pink-600 hover:text-pink-500">
                            Edit
                          </button>
                        </div>
                        <button onClick={() => removeAccount(a)} className="mt-1 text-xs leading-5 text-gray-500">
                          Remove
                        </button>
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

export default dynamic(() => Promise.resolve(NetWorth), { ssr: false });