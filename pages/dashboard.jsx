import { useState, useEffect } from 'react'
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import Cards from '../components/cards'
import Loader from '../components/loader'
import Plaid from "../components/plaid"
import Table from '../components/table'
import Head from 'next/head'
import Layout from '../components/layout'
import BarChart from '../components/bar-chart'
import PieChart from '../components/pie-chart'
import EditModal from '../components/edit-modal'
import SetupModal from '../components/setup-modal'
import Menu from '../components/menu'
import { getSession } from 'next-auth/react'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default function ({ newUser, user }) {
  const [loading, setLoading] = useState({access_token: null, loading: false})
  const [totalStats, setStats] = useState({
    lastMonthTotal: 0,
    thisMonthTotal: 0,
    thisMonthString: '',
    lastMonthString: ''
  })
  const [t, setTransactions] = useState([])
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [a, setAccounts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [pieData, setPieData] = useState([])
  const [item, setEdit] = useState({})
  const [setupModal, openSetupModal] = useState(newUser || false);

  useEffect(() => {
    if(user && !newUser){
      getDashboard()
    }
  }, [user, newUser])

  const getDashboard = async () => {
    setRefreshing(true)
    const res = await fetch(`/api/get_dashboard`, {
      body: JSON.stringify({
        user_id: user.id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { stats, accounts, transactions, monthlyIncomeData, monthlyExpenseData, categories } = await res.json()
    setExpenseData(monthlyExpenseData)
    setIncomeData(monthlyIncomeData)
    setStats(stats)
    setTransactions(transactions)
    setAccounts(accounts)
    setRefreshing(false)
    setPieData(categories)
  }

  const getAccounts = async (access_token) => {
    openSetupModal(false)
    setLoading({access_token: access_token, loading: true})
    await fetch(`/api/get_accounts`, {
      body: JSON.stringify({
        user_id: user.id,
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
    openSetupModal(false)
    setLoading({access_token: access_token, loading: true})
    getAccounts(access_token)
    const res = await fetch(`/api/sync_transactions`, {
      body: JSON.stringify({
        user_id: user.id,
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

  if (!user) return (
    <Container>
      <Menu/>
      <Preview />
    </Container>
  )

  const columns = [
    {
      Header: "Name",
      accessor: "name",
      style: "w-1/4 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Primary Category",
      accessor: "primary_category",
      style: "w-1/4 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Detailed Category",
      accessor: "detailed_category",
      style: "w-1/4 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Date",
      accessor: "authorized_date",
      style: "w-1/12 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ cell: { value } }) => '$' + Number(value).toFixed(2),
      style: "w-1/12 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    }, 
    {
      Header: '',
      id: 'id',
      accessor: data => data,
      Cell: ({ cell: { value } }) => <button onClick={() => setEdit(value)} className="text-pink-600 hover:text-pink-900">Edit</button>,
      style: "w-1/12 px-2 py-3.5 text-left text-sm font-light text-gray-900"
    }
  ]

  return (
    <Layout>
      <Head>
        <title>Trckfi - Dashboard</title>
      </Head>
      <Container>
        <Menu/>
        <SetupModal open={setupModal} getAccounts={getAccounts} syncTransactions={syncTransactions}/>
        <Loader refreshing={refreshing} />
        <EditModal item={item} setEdit={setEdit} getDashboard={getDashboard} getAccounts={getAccounts} syncTransactions={syncTransactions} />
        <div className="py-10 flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center pr-4">My Dashboard</h1> 
          <Plaid user={user} getAccounts={getAccounts} syncTransactions={syncTransactions} />
        </div>
        <Snapshot accounts={a} totalStats={totalStats} />
        <Cards accounts={a} getTransactions={syncTransactions} loading={loading} getDashboard={getDashboard} />
        {/* <hr className="w-full border-t-3 border-pink-500 mx-auto my-0" /> */}
        <div class="flex items-center justify-center">
          <PieChart pieData={pieData} />
          <BarChart monthlyIncomeData={incomeData} monthlyExpenseData={expenseData} />
        </div>
        <Table columns={columns} data={t} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { new_user } = context.query
  const session = await getSession(context)
  const user = session?.user

  if(!user) return { props: { user: null }}
  if(!user?.stripeSubscriptionId || !user?.active) return {
    redirect: {
      destination: '/getting-started',
      permanent: false,
    },
  }

  const { plan } = await stripe.subscriptions.retrieve(session.user.stripeSubscriptionId)
  if (!plan.active) return { props: { user: null, newUser: false }}

  if (new_user) return { props: { user, newUser: true } }
  return { props: { user, newUser: false } }
}