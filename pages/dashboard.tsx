import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import Snapshot from "../components/snapshot"
import LoadingModal from '../components/modals/loading-modal'
import { DateTime } from "luxon"
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
  
  useEffect(() => {
    if(intro === 'true'){
      setTimeout(() => {
        showIntro('dashboard')
      }, 1000)
    }
    if(!graphData || !totalStats){
      setRefreshing(true)
    }
    getDashboard()
    getStats()
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
    console.log(stats)
    setStats(stats)
    setRefreshing(false)
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
    const { error, data } = await res.json()
    setRefreshing(false)
    showError(error)
    setGraphData(data)
  }
  
  return (
    <div>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <Snapshot totalStats={totalStats} />
        <Graphs graphData={graphData} />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 py-2">
          <div className="col-span-1 p-6 shadow-sm rounded-md border border-gray-200">
            <UpcomingRecurring recurring={graphData.recurring}/>
          </div>
          <div className="col-span-1 p-6 shadow-sm rounded-md border border-gray-200">
            <UpcomingCredit payments={graphData.creditPayments}/>
          </div>
        </div>
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      </DashboardLayout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })