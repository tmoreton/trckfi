import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import Snapshot from "../components/snapshot"
import LoadingModal from '../components/modals/loading-modal'
import Table from '../components/table'
import TransactionModal from '../components/modals/transaction-modal'
import SetupModal from '../components/modals/setup-modal'
import DatePicker from '../components/modals/date-picker-modal'
import { DateTime } from "luxon"
import { Emoji } from 'emoji-picker-react';
import Graphs from '../components/graphs'
import { useSession } from "next-auth/react"
import  { useLocalStorage, clearLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import Meta from '../components/meta'
import ConfettiExplosion from 'react-confetti-explosion'

const Dashboard = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [item, setEdit] = useState({})
  const [setupModal, openSetupModal] = useState(false)
  const [openDatePicker, setDatePicker] = useState(false)
  const [selected, setSelected] = useState([])
  const [t, setTransactions] = useLocalStorage('transactions',[])
  const [graphData, setGraphData] = useLocalStorage('graph_data', {})
  const [totalStats, setStats] = useLocalStorage('dashboard_stats', [])
  const [showConfetti, setConfetti] = useState(false)
  const [dates, setDates] = useState({
    startDate: DateTime.now().toISO(),
    endDate: DateTime.now().minus({ months: 3 }).startOf('month').toISO()
  })

  useEffect(() => {
    getDashboard()
    getStats()
    getTransactions()
    // @ts-ignore
    if(user?.login_count <= 1 && t.length <= 0) openSetupModal(true)
  }, [])

  useEffect(() => {
    getTransactions()
  }, [dates])

  const syncPlaid = async (access_token) => {
    openSetupModal(false)
    setConfetti(true)
    setTimeout(() => {
      getStats()
      getDashboard()
    }, 2000)
    setTimeout(() => {
      getTransactions()
    }, 5000)
    const res = await fetch(`/api/sync_plaid`, {
      body: JSON.stringify({
        user,
        access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
    showError(error)
  }

  const getRecurring = async () => {
    await fetch(`/api/get_recurring`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

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
    setLoading(false)
  }

  const getDashboard = async () => {
    setLoading(true)
    if(totalStats.length <= 0) setRefreshing(true)
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
    setLoading(false)
  }

  const refresh = async () => {
    getRecurring()
    clearLocalStorage()
    setLoading(true)
    const res = await fetch(`/api/sync_accounts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    getStats()
    getDashboard()
    getTransactions()
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

  const renderImg = (account) => {
    if(account){
      let image_url = `/assets/banks/${account.institution}.png`
      return <img
        src={image_url}
        alt={account.institution}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src="/assets/banks/bank.png";
        }}
        className="h-5 w-5 flex-none rounded-md object-cover"
      />
    }
  }

  const columns = [
    {
      Header: "sort",
      accessor: data => data,
      Cell: ({ cell: { value } }) => <input className="mr-3" checked={selected?.find(e => e.id === value.id)} onChange={e => updateSelect(e, value)} type="checkbox"/>,
      style: ""
    },
    {
      Header: "unified",
      accessor: data => data.unified,
      Cell: ({ cell: { value } }) => <Emoji unified={value} size={20} />,
      style: ""
    },
    {
      Header: "Name",
      id: "name",
      accessor: "name",
      style: "min-w-[200px] w-1/4 mr-4 py-3.5 text-left text-xs font-light text-gray-900 px-2"
    },
    {
      Header: "Account",
      id: "account.name",
      accessor: data => data?.account?.name,
      Cell: ({ cell: value }) => value.row.original.account && <div className="inline-flex"><span className="mr-2">{renderImg(value.row.original.account)}</span> {value.row.original.account.name.split(' ').slice(0, 3).join(' ')}</div>,
      style: "min-w-[200px] w-1/4 pr-4 py-3.5 text-left text-xs font-light text-gray-900 px-2"
    },
    {
      Header: "Category",
      id: "category",
      accessor: data => data.primary_category+'+'+data.detailed_category,
      Cell: ({ cell: { value } }) => (
        <>
          <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{value.split('+')[0]}</span>
          <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{value.split('+')[1]}</span>
        </>
      ),
      style: "min-w-[250px] w-1/3 pr-4 py-3.5 text-left text-xs font-light text-gray-900 px-2"
    },
    {
      Header: "Date",
      id: "date",
      accessor: "date",
      style: "w-1/12 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2"
    },
    {
      Header: "Amount",
      id: "amount",
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

  const datePicker = () => {
    return <DatePicker dates={dates} setDates={setDates} openDatePicker={openDatePicker} setDatePicker={setDatePicker}/>
  }
  
  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Meta
          title="Dashboard"
          description="Your finances all in one platform"
          image=''
          keywords=''
        />
        <SetupModal user={user} showError={showError} open={setupModal} openSetupModal={openSetupModal} syncPlaid={syncPlaid} />
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>}
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
        <TransactionModal user={user} selected={selected} showError={showError} item={item} setEdit={setEdit} getTransactions={getTransactions}/>
        <Snapshot totalStats={totalStats} refresh={refresh} loading={loading}/>
        <Graphs graphData={graphData} />
        { t.length > 1 && <Table setEdit={setEdit} selected={selected} setSelected={setSelected} columns={columns} data={t} datePicker={datePicker}/>}
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })