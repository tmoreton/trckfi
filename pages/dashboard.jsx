import { useState, useEffect } from 'react'
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import Cards from '../components/cards'
import LoadingModal from '../components/loading-modal'
import Plaid from "../components/plaid"
import Table from '../components/table'
import Head from 'next/head'
import Layout from '../components/layout'
import EditModal from '../components/edit-modal'
import SetupModal from '../components/setup-modal'
import Menu from '../components/menu'
import { getSession } from 'next-auth/react'
import Stripe from 'stripe'
import DatePicker from '../components/date-picker'
import { DateTime } from "luxon"
import { useRouter } from 'next/router'
import { Emoji } from 'emoji-picker-react';
import Graphs from '../components/graphs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default function ({ newUser, user, showError }) {
  const email = user?.email
  const [loading, setLoading] = useState({access_token: null, loading: false})
  const [totalStats, setStats] = useState({})
  const [t, setTransactions] = useState([])
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [a, setAccounts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [item, setEdit] = useState({})
  const [setupModal, openSetupModal] = useState(newUser || false)
  const [categories, setCategories] = useState([])
  const [detailedCategories, setDetailedCategories] = useState([])
  const [showAccounts, setShowAccounts] = useState(false)
  const [openDatePicker, setDatePicker] = useState(false)
  const [weeklyData, setWeeklyData] = useState([])
  const router = useRouter()

  const [dates, setDates] = useState({
    startDate: DateTime.now().toISO(),
    endDate: DateTime.now().minus({ months: 6 }).startOf('month').toISO()
  })

  useEffect(() => {
    if(email && !newUser){
      getDashboard()
    }
    if(newUser){
      setShowAccounts(true)
      router.replace('/dashboard', undefined, { shallow: true });
    }
  }, [email])

  useEffect(() => {
    if(dates){
      getDashboard()
    }
  }, [dates])

  const getDashboard = async () => {
    setDatePicker(false)
    setRefreshing(true)
    const res = await fetch(`/api/get_dashboard`, {
      body: JSON.stringify({
        user_id: user.id,
        range: dates
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, stats, accounts, transactions, groupByMonth, groupByMonthIncome, categories, detailedCategories, groupByWeek } = await res.json()
    showError(error)
    setExpenseData(groupByMonth)
    setIncomeData(groupByMonthIncome)
    setWeeklyData(groupByWeek)
    setStats(stats)
    setTransactions(transactions)
    setAccounts(accounts)
    setRefreshing(false)
    setCategories(categories)
    setDetailedCategories(detailedCategories)
  }

  const getAccounts = async (access_token) => {
    openSetupModal(false)
    setLoading({access_token: access_token, loading: true})
    const res = await fetch(`/api/get_accounts`, {
      body: JSON.stringify({
        user_id: user.id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
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
    const { error, has_more } = await res.json()
    showError(error)
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
      Header: "unified",
      id: "unified",
      accessor: data => data,
      Cell: ({ cell: { value } }) => <Emoji unified={value.unified} size={20} />,
      style: "w-1/12 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Name",
      accessor: "name",
      style: "w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Primary Category",
      accessor: "primary_category",
      style: "w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Detailed Category",
      accessor: "detailed_category",
      style: "w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Date",
      accessor: "date",
      style: "w-1/12 pr-4 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ cell: { value } }) => '$' + Number(value).toFixed(2),
      style: "w-1/12 py-3.5 text-left text-sm font-light text-gray-900"
    }, 
    {
      Header: 'Download',
      id: 'id',
      accessor: data => data,
      Cell: ({ cell: { value } }) => <button onClick={() => setEdit(value)} className="text-pink-600 hover:text-pink-900">Edit</button>,
      style: "text-center w-8"
    }
  ]

  return (
    <Layout>
      <Head>
        <title>Trckfi - Dashboard</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        <SetupModal open={setupModal} openSetupModal={openSetupModal} getAccounts={getAccounts} syncTransactions={syncTransactions}/>
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
        <EditModal showError={showError} item={item} setEdit={setEdit} getDashboard={getDashboard} getAccounts={getAccounts} syncTransactions={syncTransactions} />
        <div className="py-10 flex justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-900 text-center pr-4">My Dashboard</h1> 
          <Plaid showError={showError} getAccounts={getAccounts} syncTransactions={syncTransactions} />
        </div>
        <Snapshot showAccounts={showAccounts} setShowAccounts={setShowAccounts} accounts={a} totalStats={totalStats} />
        <Cards showError={showError} showAccounts={showAccounts} accounts={a} getTransactions={syncTransactions} loading={loading} getDashboard={getDashboard} />
        <DatePicker dates={dates} setDates={setDates} openDatePicker={openDatePicker} setDatePicker={setDatePicker} />
        <Graphs categories={categories} detailedCategories={detailedCategories} incomeData={incomeData} expenseData={expenseData} weeklyData={weeklyData} />
        <Table columns={columns} data={t} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { new_user } = context.query
  const session = await getSession(context)
  const user = session?.user

  if(!user) return { 
    redirect: {
      destination: '/auth/email-signin',
      permanent: false,
    },
  }

  if(!user?.stripeSubscriptionId || !user?.active) return {
    redirect: {
      destination: '/getting-started',
      permanent: false,
    },
  }

  // const { plan } = await stripe.subscriptions.retrieve(session.user.stripeSubscriptionId)
  // if (!plan.active) return { props: { user: null, newUser: false }}

  if (new_user) return { props: { user, newUser: true } }
  return { props: { user, newUser: false } }
}