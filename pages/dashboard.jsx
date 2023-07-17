import { useState, useEffect } from 'react'
import DashboardLayout from "../components/dashboard-layout"
import Snapshot from "../components/snapshot"
import Cards from '../components/cards'
import LoadingModal from '../components/loading-modal'
import Table from '../components/table'
import TransactionModal from '../components/transaction-modal'
import SetupModal from '../components/setup-modal'
import { getSession } from 'next-auth/react'
import Stripe from 'stripe'
import DatePicker from '../components/date-picker'
import { DateTime } from "luxon"
import { useRouter } from 'next/router'
import { Emoji } from 'emoji-picker-react';
import Graphs from '../components/graphs'
import prisma from '../lib/prisma'
import Head from 'next/head'
import { snakeCase } from "snake-case";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

export default function ({ newUser, user, showError }) {
  const email = user?.email
  const router = useRouter()
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
  const [emojiCategories, setEmojiCategories] = useState([])
  const [showAccounts, setShowAccounts] = useState(false)
  const [openDatePicker, setDatePicker] = useState(false)
  const [weeklyData, setWeeklyData] = useState([])
  const [selected, setSelected] = useState([])

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
      router.replace('/dashboard', undefined, { shallow: true })
    }
  }, [email])

  useEffect(() => {
    if(dates){
      getDashboard()
    }
  }, [dates])

  const getDashboard = async () => {
    setSelected([])
    setDatePicker(false)
    setRefreshing(true)
    const res = await fetch(`/api/get_dashboard`, {
      body: JSON.stringify({
        user,
        range: dates
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, stats, accounts, transactions, groupByMonth, groupByMonthIncome, categories, detailedCategories, groupByWeek, emojiCategories } = await res.json()
    showError(error)
    setExpenseData(groupByMonth)
    setIncomeData(groupByMonthIncome)
    setWeeklyData(groupByWeek)
    setStats(stats)
    setTransactions(transactions)
    setAccounts(accounts)
    setRefreshing(false)
    setCategories(categories)
    setEmojiCategories(emojiCategories)
    setDetailedCategories(detailedCategories)
  }

  const updateTransaction = (item) => {
    let updatedTransactions = t
    item.primary_category = snakeCase(item.primary_category).toUpperCase()
    item.detailed_category = snakeCase(item.detailed_category).toUpperCase()
    let foundIndex = updatedTransactions.findIndex(t => t.id == item.id)
    updatedTransactions[foundIndex] = item
    setTransactions(updatedTransactions)
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

  const updateSelect = (e, value) => {
    let checked = e.target.checked
    let arr = selected
    if(checked){
      let found = arr.concat([value]);
      setSelected(found)
    } else {
      let found = arr.filter(( obj ) => obj.id !== value.id)
      setSelected(found)
    }
  }

  const columns = [
    {
      Header: "unified",
      accessor: data => data.unified,
      Cell: ({ cell: { value } }) => <Emoji unified={value} size={20} />,
      style: "w-1/12 py-3.5 text-left text-sm font-light text-gray-900"
    },
    {
      Header: "sort",
      accessor: data => data,
      Cell: ({ cell: { value } }) => <input checked={selected?.find(e => e.id === value.id)} onChange={e => updateSelect(e, value)} type="checkbox" className="h-4 w-4 rounded border-gray-300" />,
      style: ""
    },
    {
      Header: "Name",
      accessor: "name",
      style: "w-1/4 mr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    },
    {
      Header: "Primary Category",
      accessor: "primary_category",
      style: "w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    },
    {
      Header: "Detailed Category",
      accessor: "detailed_category",
      style: "w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    },
    {
      Header: "Date",
      accessor: "date",
      style: "w-1/12 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    },
    {
      Header: "Amount",
      accessor: "amount",
      Cell: ({ cell: { value } }) => '$' + Number(value).toFixed(2),
      style: "w-1/12 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    }, 
    {
      Header: 'Download',
      id: 'id',
      accessor: data => data,
      Cell: ({ cell: { value } }) => selected.length <= 0 && <button onClick={() => setEdit(value)} className="text-pink-600 hover:text-pink-900">Edit</button>,
      style: "text-center w-8"
    }
  ]

  return (
    <DashboardLayout showError={showError}>
      <Head>
        <title>Trckfi - Dashboard</title>
      </Head>
      <SetupModal user={user} showError={showError} open={setupModal} openSetupModal={openSetupModal} getAccounts={getAccounts} syncTransactions={syncTransactions} accounts={a}/>
      <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      <TransactionModal updateTransaction={updateTransaction} user={user} selected={selected} showError={showError} item={item} setEdit={setEdit} getDashboard={getDashboard} getAccounts={getAccounts} syncTransactions={syncTransactions} />
      <Snapshot showAccounts={showAccounts} setShowAccounts={setShowAccounts} accounts={a} totalStats={totalStats} />
      <Cards showError={showError} showAccounts={showAccounts} accounts={a} getTransactions={syncTransactions} loading={loading} getDashboard={getDashboard} />
      <Graphs emojiCategories={emojiCategories} categories={categories} detailedCategories={detailedCategories} incomeData={incomeData} expenseData={expenseData} weeklyData={weeklyData} />
      <DatePicker dates={dates} setDates={setDates} openDatePicker={openDatePicker} setDatePicker={setDatePicker} />
      <Table setEdit={setEdit} selected={selected} setSelected={setSelected} columns={columns} data={t} />
    </DashboardLayout>
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

  if(!user.subscription_id && !user.linked_user_id || !user.active) return {
    redirect: {
      destination: '/pricing',
      permanent: false,
    },
  }

  if(!user.subscription_id && user.linked_user_id) {
    const linked_user = await prisma.user.findUnique({
      where: { id: user.linked_user_id }
    })
    if(linked_user?.subscription_id){
      if (new_user) return { props: { user, newUser: true } }
      return { props: { user, newUser: false } }
    } else {
      return {
        redirect: {
          destination: '/getting-started',
          permanent: false,
        }
      }
    }
  }
  
  // const { plan } = await stripe.subscriptions.retrieve(session.user.subscription_id)
  // if (!plan.active) return { props: { user: null, newUser: false }}

  if (new_user) return { props: { user, newUser: true } }
  return { props: { user, newUser: false } }
}