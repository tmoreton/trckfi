import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import { ArrowPathIcon, PlusIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import { addComma } from '../lib/lodash'
import HomeModal from '../components/modals/home-modal'
import HideAccountModal from '../components/modals/hide-account-modal'
import EditAccountModal from '../components/modals/edit-account-modal'
import ManualModal from '../components/modals/add-manually-modal'
import StockModal from '../components/modals/stock-modal'
import LoadingModal from '../components/modals/loading-modal'
import CryptoModal from '../components/modals/crypto-modal'
import RemoveAccount from "../components/modals/remove-account-modal"
import { Emoji } from 'emoji-picker-react'
import PlaidLink from '../components/plaid-link';
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import Meta from '../components/meta'
import ConfettiExplosion from 'react-confetti-explosion'

const renderImg = (account) => {
  if(account?.subtype === 'real estate') return (<div className="my-1.5"><Emoji unified='1f3e0' size={35} /></div>)
  if(account?.subtype === 'equity') return (<div className="my-1.5"><Emoji unified='1f4c8' size={35} /></div>)
  if(account?.subtype === 'crypto') return (<img src={account?.details?.image} alt={account?.institution} className="h-12 w-12 flex-none rounded-lg bg-white object-cover"/>)
  if(!account?.institution) return (<div className="my-1.5"><Emoji unified='1f3e6' size={35} /></div>)
  let image_url = `/assets/banks/${account?.institution}.png`
  return <img 
    src={image_url} 
    onError={({ currentTarget }) => {
      currentTarget.onerror = null;
      currentTarget.src="/assets/banks/bank.png";
    }}
    className="h-12 w-12 rounded-md object-cover lg:block hidden"
  />
}

const Accounts = ({ showError }) => {
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
  const [accounts, setAccounts] = useLocalStorage('net_worth_accounts', {})
  const [removedAccounts, setRemovedAccounts] = useState([])
  const [showConfetti, setConfetti] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    getAccounts()
  }, [showConfetti])

  const editAccount = (a) => {
    setAccount(a)
    setOpenEdit(true)
  }

  const hideAccount = (a) => {
    setAccount(a)
    setOpen(true)
  }

  const syncPlaid = async (access_token) => {
    setRefreshing(true)
    const res = await fetch(`/api/sync_plaid`, {
      body: JSON.stringify({
        user,
        access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) {
      getAccounts()
      setRefreshing(false)
      setConfetti(true)
    }
  }

  const getAccounts = async () => {
    const res = await fetch(`/api/get_accounts`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)

    const accounts = data.reduce(function (r, a) {
      r[a.institution] = r[a.institution] || [];
      r[a.institution].push(a);
      return r;
    }, Object.create(null))
    setAccounts(accounts)
  }

  const refresh = async () => {
    setLoading(true)
    fetch(`/api/update_crypto_price`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    fetch(`/api/update_stock_price`, {
      body: JSON.stringify({
        // @ts-ignore
        user_id: user.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const res = await fetch(`/api/sync_accounts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setLoading(false)
    const { error } = await res.json()
    showError(error)
    if(!error) getAccounts()
  }

  const unhideAccount = async (account) => {
    const res = await fetch(`/api/unhide_account`, {
      body: JSON.stringify({
        user, account
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getAccounts()
  }

  const removeToken = async (account) => {
    setRemovedAccounts([])
    const res = await fetch(`/api/remove_access_token`, {
      body: JSON.stringify({ account }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getAccounts()
  }

  const syncAccount = async (plaid) => {
    setLoading(true)
    setRemovedAccounts([])
    const res = await fetch(`/api/sync_account`, {
      body: JSON.stringify({ plaid, user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getAccounts()
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Meta
          title="Accounts"
          description="A place to organize your accounts"
          image=''
          keywords=''
        />
        <LoadingModal refreshing={refreshing} text='Updating Your Accounts...'/>
        <EditAccountModal showError={showError} open={openEdit} setOpen={setOpenEdit} user={user} account={account} setAccount={setAccount} getNetWorth={getAccounts}/>
        <StockModal showError={showError} open={openStock} setOpen={setOpenStock} user={user} getNetWorth={getAccounts}/>
        <CryptoModal showError={showError} open={openCrypto} setOpen={setOpenCrypto} user={user} getNetWorth={getAccounts}/>
        <HomeModal showError={showError} open={openHome} setOpen={setOpenHome} user={user} getNetWorth={getAccounts}/>
        <ManualModal showError={showError} open={openManually} setOpen={setOpenManually} user={user} getNetWorth={getAccounts} />
        <HideAccountModal showError={showError} open={open} setOpen={setOpen} user={user} account={account} getNetWorth={getAccounts} />
        <RemoveAccount setRemovedAccounts={setRemovedAccounts} removeToken={removeToken} removedAccounts={removedAccounts} />
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>}
        <div className="lg:flex justify-center lg:space-x-6 space-x-0 mb-4 sm:block">
          <button onClick={() => setOpenStock(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add Stock
          </button>
          <button onClick={() => setOpenHome(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add Home Value
          </button>
          <button  onClick={() => setOpenCrypto(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            Add Crypto
          </button>
          <PlaidLink user={user} showError={showError} refresh_access_token={null} syncPlaid={syncPlaid}/>
          <button  onClick={() => setOpenManually(true)} className="mb-4 inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100 justify-center w-[100%] lg:w-52">
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
          <div>
            <div className="overflow-hidden border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
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
                      <div role="list" className="divide-y divide-gray-100 border-gray-200 text-sm leading-6">
                        {
                          Object.keys(accounts).map(key => {
                            if(Object.keys(accounts)?.length > 0){
                              let error_code = accounts[key][0]?.plaid?.error_code
                              if(accounts[key][0]){
                                return (
                                  <div key={key} className="flex justify-between gap-x-6 py-6 items-center">
                                    {renderImg(accounts[key][0])}
                                    <div className="w-[100%]">
                                      { accounts[key].map((a, i) => (
                                        <div key={accounts[key][i].id}>
                                          { i <= 0 && 
                                            <td className="flex items-center mb-2">
                                              <div>
                                                <p className="text-lg font-bold text-gray-900 flex">{a.institution} {error_code && <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-1 ml-2" aria-hidden="true" />}</p>
                                                {/* <div className="flex items-center">
                                                  <p className="text-xs leading-5 text-gray-500 font-semibold pr-2">Last Updated:</p>
                                                  <p className="text-xs text-gray-400">{DateTime.fromISO(a?.plaid?.updated_at || a.updated_at).toLocaleString(DateTime.DATETIME_SHORT)}</p>
                                                </div> */}
                                              </div>
                                            </td>
                                          }
                                          <tr className="lg:text-sm text-xs text-gray-900 pt-1 flex justify-between">
                                            <td className="w-1/2 font-semibold text-left">
                                              {a.name} 
                                              - 
                                              <span className="font-light hidden lg:inline-flex">{a.official_name}</span>
                                              <button onClick={() => unhideAccount(a)} className="ml-2 text-red-600">{!a.active && 'Show Account'}</button>
                                            </td>
                                            <td className="w-1/6 font-light text-left text-xs hidden lg:block">{a.type}</td> 
                                            <td className="w-1/4 font-semibold text-left">{addComma(a.amount)}</td> 
                                            <button onClick={() => hideAccount(a)} className="text-xs text-gray-400 text-right hidden lg:block">Hide</button> 
                                            <button onClick={() => editAccount(a)} className="w-20 text-red-600 text-right">Edit</button> 
                                          </tr>
                                        </div>
                                      ))}
                                      <div className="pt-5">
                                        { error_code === 'ITEM_LOGIN_REQUIRED' && 
                                          <PlaidLink user={user} showError={showError} refresh_access_token={accounts[key][0]?.plaid?.access_token} syncPlaid={syncPlaid}/>
                                        }
                                        { error_code === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' && 
                                          <button onClick={() => syncAccount(accounts[key][0]?.plaid)} type="button" className="text-xs flex items-center text-red-600 hover:text-red-500">
                                            <div className={loading && 'animate-spin'}>
                                              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <span className="ml-2">Resync Account</span>
                                          </button>
                                        }
                                        { error_code !== 'ITEM_LOGIN_REQUIRED' && error_code !== 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' &&
                                          <button onClick={() => setRemovedAccounts(accounts[key])} type="button" className="text-xs flex items-center text-red-600 hover:text-red-500">
                                            <div className={loading && 'animate-spin'}>
                                              { loading && <ArrowPathIcon className="h-5 w-5" aria-hidden="true" /> }
                                            </div>
                                            <span className="ml-2">Remove Connection</span>
                                          </button>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                            }
                          })
                        }
                      </div>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Accounts), { ssr: false })