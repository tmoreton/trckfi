import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import { addComma } from '../lib/lodash'
import LoadingModal from '../components/modals/loading-modal'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import Meta from '../components/meta'
import PieChart from "../components/pie-chart"
import LineChart from "../components/line-chart"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const NetWorth = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [data, setData] = useLocalStorage('net_worth_data', [])
  const [history, setHistory] = useLocalStorage('net_worth_history', [])
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    getNetWorth()
  }, [])

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
    const { error, data, netWorthHistory } = await res.json()
    showError(error)
    setData(data)
    setHistory(netWorthHistory)
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Meta
          title="Net Worth"
          description="Track your Net Worth in one place"
          image=''
          keywords=''
        />
        <LoadingModal refreshing={refreshing} text='Updating Your Net Worth...'/>
        <main>
          <div className="relative isolate overflow-hidden">
            {/* Stats */}
            <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
              <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
                <div className="flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">Net Worth</dt>
                  <dd className={classNames(
                      data?.stats?.net_worth < 0 ? 'text-rose-600' : 'text-green-600',
                      'w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-900'
                    )}
                  >
                    {addComma(data?.stats?.net_worth)}
                  </dd>
                </div>
                <div className="sm:border-l lg:border-l flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">Assets</dt>
                  <dd className="text-green-600 w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-900">
                    {addComma(data?.stats?.assets)}
                  </dd>
                </div>
                <div className="sm:border-l lg:border-l flex items-baseline flex-wrap justify-between gap-y-1 gap-x-4 border-t border-gray-900/5 px-4 py-6 sm:px-6 lg:border-t-0 xl:px-8">
                  <dt className="text-sm font-medium leading-6 text-gray-500">Liabilities</dt>
                  <dd className="text-green-600 w-full flex-none text-3xl font-bold leading-10 tracking-tight text-rose-600">
                    {addComma(data?.stats?.liabilities)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="mx-auto grid max-w-2xl grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-3 py-12">
            <div className="col-span-1 pb-4 lg:px-0 px-6 sm:pt-2">
              <PieChart data={data}/>
            </div>
            <div className="col-span-2 lg:px-0 lg:pl-12 pl-0 pb-4 pl-32 px-6 sm:pt-2">
              <LineChart history={history}/>
            </div>
          </div>
        </main>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(NetWorth), { ssr: false })