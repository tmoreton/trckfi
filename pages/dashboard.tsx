import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import Snapshot from "../components/snapshot"
import LoadingModal from '../components/modals/loading-modal'
import Table from '../components/table'
import TransactionModal from '../components/modals/transaction-modal'
import DatePicker from '../components/modals/date-picker-modal'
import { DateTime } from "luxon"
import { Emoji } from 'emoji-picker-react';
import Graphs from '../components/graphs'
import { useSession } from "next-auth/react"
import { useLocalStorage } from '../utils/useLocalStorage'
import Menu from '../components/menu'
import Notification from '../components/notification'
import { useRouter } from 'next/router'
import ImportModal from '../components/modals/import-modal'

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
      accessor: data => data.custom_name || data.merchant_name || data.name,
      style: "min-w-[200px] w-1/4 mr-4 py-3.5 text-left text-xs font-light text-gray-900 px-2"
    },
    {
      Header: "Account",
      id: "account.name",
      accessor: data => data?.account?.name,
      Cell: ({ cell: value }) => {
        if(value.row.original.account){
          return <div className="inline-flex"><span className="mr-2">{renderImg(value.row.original.account)}</span> {value.row.original.account.name.split(' ').slice(0, 3).join(' ')}</div>
        }
        return value.row.original.account_name
      },
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
    <div>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <TransactionModal user={user} selected={selected} showError={showError} item={item} setEdit={setEdit} />
        <ImportModal user={user} open={showImport} setOpen={setShowImport} showError={showError} setRefreshing={setRefreshing} />
        <Snapshot totalStats={totalStats} />
        { transactions &&
          <>
            <Graphs graphData={graphData} />
            <Table setShowImport={setShowImport} user={user} setEdit={setEdit} selected={selected} setSelected={setSelected} columns={columns} data={transactions} datePicker={datePicker}/>
          </>
        }
        {/* { transactions && transactions.length < 1 &&
          <div className="flex justify-center items-center my-20">
            <div className="text-center">
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No Transactions Yet</h3>
              <p className="mt-1 text-lg text-gray-500">Get started by adding a bank connection to import transactions on the <b>Net Worth & Accounts</b> page.</p>
            </div>
          </div>
        } */}
        <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      </DashboardLayout>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })