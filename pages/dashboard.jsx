import { useState, useEffect, useMemo } from 'react'
import Transactions from "../components/transactions"
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import { useSession } from "next-auth/react"
import Header from '../components/header'
import Cards from '../components/cards'
import Loader from '../components/loader'
import Plaid from "../components/plaid"
import PieChart from '../components/pie-chart'
import Table from '../components/table'
// import BarChart from '../components/bar-chart'

export default function () {
  const { data: session } = useSession()
  const [loading, setLoading] = useState({access_token: null, loading: false})
  const [totalStats, setStats] = useState({
    lastMonthTotal: 0,
    thisMonthTotal: 0
  })
  const [t, setTransactions] = useState([])
  const [pieChart, setChartData] = useState([])
  const [a, setAccounts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if(session && t.length < 1){
      getDashboard();
    }
  }, [session]);

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
    const { stats, accounts, transactions, categories } = await res.json()
    setStats(stats)
    setChartData(categories)
    setTransactions(transactions)
    setAccounts(accounts)
    setRefreshing(false)
  }

  const getAccounts = async (access_token) => {
    setLoading({access_token: access_token, loading: true})
    await fetch(`/api/get_accounts`, {
      body: JSON.stringify({
        user_id: session.user.id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    getDashboard()
  }

  const syncTransactions = async (access_token) => {
    setLoading({access_token: access_token, loading: true})
    const res = await fetch(`/api/sync_transactions`, {
      body: JSON.stringify({
        user_id: session.user.id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { has_more } = await res.json()
    if(has_more){
      syncTransactions(access_token)
    } else {
      setLoading({access_token: null, loading: false})
      getDashboard()
    }
  }

  if (!session) return (
    <Container>
      <Header/>
      <Preview />
    </Container>
  )

  const columns = [
    {
      Header: "Name",
      accessor: "name"
    },
    {
      Header: "Category",
      accessor: "primary_category",
      // Cell: ({ cell: { value } }) => <Genres values={value} />
    },
    {
      Header: "Date",
      accessor: "authorized_date"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ cell: { value } }) => '$' + Number(value).toFixed(2)
    }, 
    {
      Header: '',
      accessor: "transaction_id",
      Cell: ({ cell: { value } }) => <button className="text-pink-600 hover:text-pink-900">Edit</button>

    }
  ]

  return (
    <Container>
      <Loader refreshing={refreshing} />
      <Header/>
      <div className='flex items-center justify-center'>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <Plaid getAccounts={getAccounts} syncTransactions={syncTransactions} />
      </div>
      <Cards accounts={a} getTransactions={syncTransactions} loading={loading} getDashboard={getDashboard} />
      <Snapshot accounts={a} totalStats={totalStats} />
      {/* <PieChart pieChart={pieChart}/>
      <BarChart /> */}
      <hr class="h-px mb-8 mt-10 bg-gray-400 border-1" />
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
      <Table columns={columns} data={t} />
    
      {/* <Transactions transactions={t} /> */}
    </Container>
  )
}