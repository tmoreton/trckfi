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
import RemoveAccount from "../components/modals/remove-account-modal"
import { Emoji } from 'emoji-picker-react'
import PlaidLink from '../components/plaid-link';
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import ConfettiExplosion from 'react-confetti-explosion'
import SetupModal from '../components/modals/setup-modal'
import { classNames } from '../lib/lodash'
import PieChart from "../components/pie-chart"
import LineChart from "../components/line-chart"
import StackedBarChart from "../components/stacked-bar-chart"
import Empty from '../components/empty'
import AddAccounts from '../components/add-accounts'

const renderImg = (account) => {
  if(account?.subtype === 'real estate' || account?.subtype === 'real_estate') return (<div className="my-1.5"><Emoji unified='1f3e0' size={35} /></div>)
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
  const [openEdit, setOpenEdit] = useState(false)
  const [account, setAccount] = useState({})
  const [removedAccounts, setRemovedAccounts] = useState([])
  const [showConfetti, setConfetti] = useState(false)
  const [setupModal, openSetupModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [accounts, setAccounts] = useLocalStorage('net_worth_accounts', {})
  const [stats, setStats] = useLocalStorage('net_worth_stats', null)
  const [history, setHistory] = useLocalStorage('net_worth_history', null)
  
  useEffect(() => {
    if(!stats || !history){
      setRefreshing(true)
    }
  }, [])

  useEffect(() => {
    getAccounts()
    getNetWorth()
  }, [showConfetti])

  const editAccount = (a) => {
    // @ts-ignore
    if(a.user_id !== user.id){
      showError('Only Account owner is allowed to update')
    } else {
      setAccount(a)
      setOpenEdit(true)
    }
  }

  const hideAccount = (a) => {
    setAccount(a)
    setOpen(true)
  }

  const refresh = () => {
    getAccounts()
    getNetWorth()
  }

  const getNetWorth = async () => {
    const res = await fetch(`/api/get_net_worth`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, history, stats } = await res.json()
    showError(error)
    setRefreshing(false)
    setStats(stats)
    setHistory(history)
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
      openSetupModal(false)
      setRefreshing(false)
      setConfetti(true)
      getNetWorth()
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
    setRefreshing(false)
    if(data.length <= 0){
      openSetupModal(true)
    }
    const accounts = data.reduce(function (r, a) {
      let key = `${a.institution}-${a.user_id}`
      r[key] = r[key] || [];
      r[key].push(a);
      return r;
    }, Object.create(null))    
    setAccounts(accounts)
  }

  const unhideAccount = async (account) => {
    setRefreshing(true)
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
    if(!error) refresh()
  }

  const removeToken = async (account) => {
    setRefreshing(true)
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
    if(!error) refresh()
  }

  const updateNetWorth = async () => {
    setLoading(true)
    const res = await fetch(`/api/update_net_worth`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setLoading(false)
    if(!error) refresh()
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <LoadingModal refreshing={refreshing} text='Updating Your Accounts...'/>
        <EditAccountModal showError={showError} open={openEdit} setOpen={setOpenEdit} user={user} account={account} setAccount={setAccount} getNetWorth={refresh}/>
        <HideAccountModal showError={showError} open={open} setOpen={setOpen} user={user} account={account} getNetWorth={refresh} />
        <RemoveAccount setRemovedAccounts={setRemovedAccounts} removeToken={removeToken} removedAccounts={removedAccounts} />
        <SetupModal user={user} showError={showError} open={setupModal} openSetupModal={openSetupModal} syncPlaid={syncPlaid} />
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>}
        <div className="lg:flex justify-center lg:space-x-6 space-x-0 items-center">
          <AddAccounts refresh={refresh} syncPlaid={syncPlaid}/>
          <button
            onClick={updateNetWorth}
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 pb-4"
          >
            <div className={loading && "animate-spin"}>
              <ArrowPathIcon className="h-7 w-7" aria-hidden="true" />
            </div>
            <p className="font-bold ml-2">Refresh</p>
          </button>
        </div>
        {/* Net Worth Page */}
        <main>
          <div className="relative isolate overflow-hidden">
            {/* Stats */}
            <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
              <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
                <div className="flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-md font-medium leading-6 text-gray-600">Net Worth</dt>
                  <dd className={classNames(
                      stats?.stats?.net_worth < 0 ? 'text-rose-600' : 'text-green-600',
                      'w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-900'
                    )}
                  >
                    {addComma(stats?.stats?.net_worth)}
                  </dd>
                </div>
                <div className="sm:border-l lg:border-l flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-md font-medium leading-6 text-gray-600">Assets</dt>
                  <dd className="text-green-600 w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    {addComma(stats?.stats?.assets)}
                  </dd>
                </div>
                <div className="sm:border-l lg:border-l flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-md font-medium leading-6 text-gray-600">Liabilities</dt>
                  <dd className="text-green-600 w-full flex-none text-3xl font-bold leading-10 tracking-tight text-rose-600">
                    {addComma(stats?.stats?.liabilities)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          { !history || history.length <=0 && Object.keys(accounts)?.length <= 0 ?
            <Empty />
            :
            <div className="mx-auto max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-3 py-6 hidden md:grid">
              <div className="col-span-1 pb-4 lg:px-0 px-6 sm:pt-2">
                { stats && <PieChart data={stats}/>}
              </div>
              <div className="col-span-2 lg:px-0 lg:pl-12 pl-0 pb-4 pl-32 px-6 sm:pt-2 hidden md:block">
                { history && <StackedBarChart history={history}/>}
              </div>
            </div>
          }
        </main>

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
                                  <div key={key} className="flex justify-between md:gap-x-6 md:py-6 py-4 items-center">
                                    <div className="hidden md:block">
                                      {renderImg(accounts[key][0])}
                                    </div>
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
                                            <div className="hidden md:flex">
                                              <button onClick={() => hideAccount(a)} className="text-xs text-gray-400 text-right hidden lg:block">Hide</button> 
                                              <button onClick={() => editAccount(a)} className="w-20 text-red-600 text-right">Edit</button> 
                                            </div>
                                          </tr>
                                        </div>
                                      ))}
                                      <>
                                        { error_code === 'ITEM_LOGIN_REQUIRED' && 
                                          <PlaidLink user={user} showError={showError} refresh_access_token={accounts[key][0]?.plaid?.access_token} syncPlaid={syncPlaid}/>
                                        }
                                        { error_code === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' && 
                                          <button onClick={() => syncPlaid(accounts[key][0]?.plaid?.access_token)} type="button" className="text-xs flex items-center text-red-600 hover:text-red-500">
                                            <div className={loading && 'animate-spin'}>
                                              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <span className="ml-2">Resync Account</span>
                                          </button>
                                        }
                                        { accounts[key][0]?.account_id && error_code !== 'ITEM_LOGIN_REQUIRED' && error_code !== 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION' &&
                                          <button onClick={() => setRemovedAccounts(accounts[key])} type="button" className="pt-4 text-xs flex items-center text-red-600 hover:text-red-500">
                                            <div className={loading && 'animate-spin'}>
                                              { loading && <ArrowPathIcon className="h-5 w-5" aria-hidden="true" /> }
                                            </div>
                                            <span className={classNames(loading && 'ml-2')}>Remove Bank Connection</span>
                                          </button>
                                        }
                                      </>
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