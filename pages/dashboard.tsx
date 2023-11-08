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
import ImportModal from '../components/modals/import-modal'
import { BanknotesIcon } from '@heroicons/react/20/solid'
import GoalCard from '../components/goal-card'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: null,
  image: null,
  user_id: null
}

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
  const [goal, setGoal] = useState(null)
  const [goals, setGoals] = useLocalStorage('goals', [])

  useEffect(() => {
    getGoals()
  }, [user])

  const getGoals = async () => {
    setGoal(null)
    const res = await fetch(`/api/get_goals`, {
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
    if(!error) setGoals(data)
    setRefreshing(false)
  }

  const remove = async (id) => {
    setRefreshing(true)
    await fetch(`/api/remove_goal`, {
      body: JSON.stringify({
        id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    router.reload()
  }
  
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
    getTransactions()
  }, [])

  useEffect(() => {
    getTransactions()
  }, [dates])

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

  const getTransactions = async () => {
    setDatePicker(false)
    setSelected([])
    const res = await fetch(`/api/get_transactions`, {
      body: JSON.stringify({
        user,
        range: dates
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    setTransactions(data)    
    setRefreshing(false)
  }
  
  return (
    <div>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <ImportModal user={user} open={showImport} setOpen={setShowImport} showError={showError} setRefreshing={setRefreshing} />
        <Snapshot totalStats={totalStats} />
        { transactions && <Graphs graphData={graphData} /> }
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 pb-12">
          {goals.map(g => <GoalCard user={user} defaultGoal={g} remove={remove} getGoals={getGoals} setRefreshing={setRefreshing}/>)}
          { goal && <GoalCard user={user} defaultGoal={goal} remove={() => setGoal(null)} getGoals={getGoals} setRefreshing={setRefreshing}/>}
          <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200">
            <button
              type="button"
              onClick={() => setGoal(defaultGoal)}
              className=" h-full relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <BanknotesIcon className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
              <div className="flex justify-center items-center mt-3">
                <span className="block text-2xl font-semibold text-gray-500">Add New Goal</span>
              </div>
            </button>
          </div>
        </div>
        {/* <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 md:pb-12 pb-2">
          <div className="bar-step col-span-1 px-4 pb-4 shadow-sm sm:px-6 sm:pt-2 rounded-md border border-gray-200 hidden md:block">
            <p>test</p>
          </div>
          <div className="bar-step col-span-1 px-4 pb-4 shadow-sm sm:px-6 sm:pt-2 rounded-md border border-gray-200 hidden md:block">
          <p>test</p>
          </div>
        </div> */}
      </DashboardLayout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })