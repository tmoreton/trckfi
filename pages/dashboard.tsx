import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import Snapshot from "../components/snapshot"
import LoadingModal from '../components/modals/loading-modal'
import Graphs from '../components/graphs'
import { useSession } from "next-auth/react"
import { useLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import Notification from '../components/notification'
import { useRouter } from 'next/router'
import UpcomingRecurring from '../components/upcoming_recurring'
import UpcomingCredit from '../components/upcoming_credit'

const Dashboard = ({ showError, showIntro }) => {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { intro } = router.query
  const [refreshing, setRefreshing] = useState(false)
  const [graphData, setGraphData] = useLocalStorage('graph_data', {})
  const [totalStats, setStats] = useLocalStorage('dashboard_stats', [])
  const [netWorth, setNetWorth] = useLocalStorage('net_worth_stats', [])
  const [history, setHistory] = useLocalStorage('net_worth_history', null)
  const [creditPayments, setCreditPayments] = useLocalStorage('credit_payments', null)
  const [recurring, setRecurring] = useLocalStorage('recurring_payments', null)
  const [allRecurring, setAllRecurring] = useLocalStorage('all_recurring_payments', null)

  useEffect(() => {
    if(intro === 'true'){
      setTimeout(() => {
        showIntro('dashboard')
      }, 1000)
    }
    if(!Object.keys(graphData) || totalStats.length < 1){
      setRefreshing(true)
    }
    getDashboard()
    getStats()
    getNetWorth()
    getRecurring()
  }, [])

  const getStats = async () => {
    const res = await fetch(`/api/get_stats`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { stats } = await res.json()
    setStats(stats)
  }

  const getRecurring = async () => {
    const res = await fetch(`/api/get_recurring`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { recurring, creditPayments, all } = await res.json()
    setRecurring(recurring.splice(0, 6))
    setCreditPayments(creditPayments.splice(0, 5))
    setAllRecurring(all)
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
    const { error, stats, history } = await res.json()
    showError(error)
    setNetWorth(stats)
    setHistory(history)
  }

  const getDashboard = async () => {
    getStats()
    const res = await fetch(`/api/get_dashboard`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { data } = await res.json()
    setGraphData(data)
    setRefreshing(false)
  }
  
  return (
    <div>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <Snapshot totalStats={totalStats} netWorth={netWorth} history={history}/>
        <Graphs graphData={graphData} />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 py-2">
          <div className="col-span-1 p-6 shadow-sm rounded-md border border-gray-200">
            { recurring && <UpcomingRecurring recurring={recurring}/>}
          </div>
          <div className="col-span-1 p-6 shadow-sm rounded-md border border-gray-200">
          { creditPayments && <UpcomingCredit payments={creditPayments}/>}
          </div>
        </div>
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      </DashboardLayout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })