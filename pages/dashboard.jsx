import { useState, useEffect } from 'react'
import Transactions from "../components/transactions"
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import { useSession } from "next-auth/react"
import Header from '../components/header'
import Cards from '../components/cards'
import Loader from '../components/loader'
import Plaid from "../components/plaid"
// import PieChart from '../components/pie-chart'
// import BarChart from '../components/bar-chart'

export default function () {
  const { data: session } = useSession()
  const [loading, setLoading] = useState({access_token: null, loading: false})
  const [thisMonth, setThisMonth] = useState([])
  const [lastMonth, setLastMonth] = useState([])
  const [thisWeek, setThisWeek] = useState([])
  const [lastWeek, setLastWeek] = useState([])
  const [accounts, setAccounts] = useState([])
  const [plaid, setPlaid] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if(session && thisMonth.length < 1){
      getDashboard();
    }
  }, [session]);

  // const sendEmail = async () => {
  //   const res = await fetch(`/api/send_weekly_email`, {
  //     body: '',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //   })
  // }

  const getDashboard = async () => {
    setRefreshing(true)
    const res = await fetch(`/api/get_dashboard`, {
      body: JSON.stringify({
        user_id: session.user.id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { thisMonth, lastMonth, thisWeek, lastWeek, accounts, plaid } = await res.json()
    setThisMonth(thisMonth)
    setLastMonth(lastMonth)
    setThisWeek(thisWeek)
    setLastWeek(lastWeek)
    setAccounts(accounts)
    setPlaid(plaid)
    setRefreshing(false)
  }

  const getTransactions = async (access_token) => {
    setLoading({access_token: access_token, loading: true})
    await fetch(`/api/get_transactions`, {
      body: JSON.stringify({
        user_id: session.user.id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setLoading({access_token: null, loading: false})
    getDashboard()
  }

  if (!session) return (
    <Container>
      <Header/>
      <Preview />
    </Container>
  )

  return (
    <Container>
      <Loader refreshing={refreshing} />
      <Header/>
      <div className='flex items-center justify-center'>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <Plaid getTransactions={getTransactions} />
      </div>
      <Cards accounts={accounts} getTransactions={getTransactions} tokens={plaid} loading={loading} getDashboard={getDashboard} />
      <Snapshot accounts={accounts} thisMonth={thisMonth} lastMonth={lastMonth} thisWeek={thisWeek} lastWeek={lastWeek} />
      {/* <div className="grid min-h-full place-items-center py-4">
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="relative flex items-center space-x-3 px-6 py-5">
              <PieChart />
          </div>
          <div className="relative flex items-center space-x-3 px-6 py-5">
            <BarChart />
          </div>
        </div>
      </div> */}
      <Transactions transactions={thisMonth} />
    </Container>
  )
}