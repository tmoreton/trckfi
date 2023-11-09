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

const Dashboard = ({ showError, showIntro }) => {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const { intro } = router.query
  const [refreshing, setRefreshing] = useState(false)
  const [item, setEdit] = useState({})
  const [openDatePicker, setDatePicker] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [selected, setSelected] = useState([])
  const [transactions, setTransactions] = useLocalStorage('transactions',null)
  const [graphData, setGraphData] = useLocalStorage('graph_data', {})
  const [totalStats, setStats] = useLocalStorage('dashboard_stats', [])
  const [dates, setDates] = useState({
    startDate: DateTime.now().toISO(),
    endDate: DateTime.now().minus({ months: 3 }).startOf('month').toISO()
  })
  
  useEffect(() => {
    if(intro === 'true'){
      setTimeout(() => {
        showIntro('dashboard')
      }, 1000)
    }
    if(!transactions){
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
    setStats(stats)
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
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      </DashboardLayout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })