import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../../components/dashboard-layout"
import LoadingModal from '../../components/modals/loading-modal'
import Table from './table'
import TransactionModal from '../../components/modals/transaction-modal'
import RemoveTransactionModal from '../../components/modals/remove-transaction-modal'
import DatePicker from '../../components/modals/date-picker-modal'
import { DateTime } from "luxon"
import { Emoji } from 'emoji-picker-react';
import { useSession } from "next-auth/react"
import { useLocalStorage } from '../../utils/useLocalStorage'
import Menu from '../../components/menu-dashboard'
import Notification from '../../components/notification'
import ImportModal from '../../components/modals/import-modal'
import { DropdownFilter, TextSearchFilter } from "../../utils/filter";
import { addComma } from '../../lib/lodash'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import MobileTransactions from './mobile'

const Dashboard = ({ showError, showIntro, setSuccess }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [refreshing, setRefreshing] = useState(false)
  const [item, setEdit] = useState({})
  const [removeItem, setRemoveItem] = useState(false)
  const [openDatePicker, setDatePicker] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [selected, setSelected] = useState([])
  const [transactions, setTransactions] = useLocalStorage('transactions', null)
  const [dates, setDates] = useState({
    startDate: DateTime.now().toISO(),
    endDate: DateTime.now().minus({ months: 6 }).startOf('month').toISO()
  })
  
  useEffect(() => {
    if(!transactions){
      setRefreshing(true)
    }
    getTransactions()
  }, [])

  useEffect(() => {
    getTransactions()
  }, [dates])

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
    // showError(error)
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

  const deleteRow = async (id) => {
    let new_transactions = transactions.filter((data) => data.id !== id )
    setTransactions(new_transactions)
    setRemoveItem(false)
    await fetch(`/api/remove_transaction`, {
      body: JSON.stringify({ 
        ids: [id]
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
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

  const renderTags = (item) => {
    let tags = item.row.original.tags
    return tags?.map(tag => <span className="inline-flex items-center rounded-full bg-pink-600 px-2 py-1 text-[10px] font-medium text-white ring-1 ring-inset ring-pink-600/10 m-1">{tag}</span>)
  }

  const columns = [
    {
      Header: "sort",
      accessor: data => data,
      Cell: ({ cell: { value } }) => <input className="mr-3" checked={selected?.find(e => e.id === value.id)} onChange={e => updateSelect(e, value)} type="checkbox"/>,
      style: "",
      Filter: TextSearchFilter,
    },
    {
      Header: "unified",
      accessor: data => data.unified,
      Cell: ({ cell: { value } }) => <Emoji unified={value} size={20} />,
      style: "",
      Filter: DropdownFilter,
    },
    {
      Header: "Name",
      id: "name",
      accessor: data => data?.custom_name || data?.merchant_name || data?.name,
      style: "min-w-[200px] w-1/4 mr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: TextSearchFilter
    },
    {
      Header: "Account",
      id: "account.name",
      accessor: data => data?.account?.name,
      Cell: ({ cell: value }) => {
        if(value.row.original.account){
          return <div className="inline-flex"><span className="mr-2">{renderImg(value.row.original.account)}</span> {value.row.original.account?.name?.split(' ').slice(0, 3).join(' ')}</div>
        }
        return value.row.original.account_name
      },
      style: "min-w-[200px] w-1/4 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: DropdownFilter
    },
    {
      Header: "User",
      accessor: data => data.user && data.user?.email?.split('@')[0],
      Cell: ({ cell: { value } }) => value,
      style: "",
      Filter: DropdownFilter
    },
    {
      Header: "Primary Category",
      id: "primary_category",
      accessor: data => data.primary_category,
      Cell: ({ cell: { value } }) => <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{value}</span>,
      style: "min-w-[200px] w-1/3 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: DropdownFilter
    },
    {
      Header: "Detailed Category",
      id: "detailed_category",
      accessor: data => data.detailed_category,
      Cell: ({ cell: { value } }) => { return <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-[10px] font-medium text-pink-600 ring-1 ring-inset ring-pink-600/10 m-1">{value}</span>},
      style: "min-w-[200px] w-1/3 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: DropdownFilter
    },
    {
      Header: "Tags",
      id: "tags",
      accessor: (row, index) => row.tags?.map(tag => tag),
      Cell: ({ cell: value }) => renderTags(value),
      style: "min-w-[125px] w-1/3 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: DropdownFilter
    },
    {
      Header: "Date",
      id: "date",
      accessor: "date",
      // Cell: ({ cell: { value } }) => <span>{DateTime.fromISO(value).toFormat('MMM d, yyyy')}</span>,
      style: "w-1/12 pr-4 py-3.5 text-left text-sm font-light text-gray-900 px-2",
      Filter: TextSearchFilter
    },
    {
      Header: "Amount",
      id: "amount",
      accessor: "amount",
      Cell: ({ cell: { value } }) => value > 0 ? <span className="text-green-600 font-bold">{addComma(value)}</span> : <span className="text-red-600 font-semibold text-md">{addComma(value)}</span>,
      style: "w-1/12 py-3.5 text-left font-semibold px-2",
      Filter: TextSearchFilter
    }, 
    {
      Header: 'Download',
      id: 'id',
      accessor: data => data,
      Cell: ({ cell: { value } }) => selected.length <= 0 && (
        <div className="flex">
          <button onClick={() => setEdit(value)} className="text-pink-600 hover:text-pink-500">
            <PencilSquareIcon className="m-1 h-4 w-4" />
          </button>
          <button onClick={() => setRemoveItem(value.id)} className="text-red-600 hover:text-red-500">
            <TrashIcon className="m-1 h-4 w-4" />
          </button>
        </div>
      ),
      style: "text-center w-8",
      Filter: DropdownFilter
    }
  ]

  const datePicker = () => {
    return <DatePicker dates={dates} setDates={setDates} openDatePicker={openDatePicker} setDatePicker={setDatePicker}/>
  }
  
  return (
    <>
      <div className="block lg:hidden">
        <MobileTransactions showError={showError}/>
      </div>
      <div className="hidden lg:block">
        <Menu showError={showError} title='Transactions'/>
        <Notification showError={showError} />
        <DashboardLayout>
          <TransactionModal user={user} selected={selected} showError={showError} item={item} setEdit={setEdit} transactions={transactions} setTransactions={setTransactions}/>
          <RemoveTransactionModal open={removeItem} setOpen={setRemoveItem} deleteRow={deleteRow}/>
          <ImportModal user={user} open={showImport} setOpen={setShowImport} getTransactions={getTransactions} setSuccess={setSuccess} />
          <Table setShowImport={setShowImport} user={user} setEdit={setEdit} selected={selected} setSelected={setSelected} columns={columns} data={transactions} datePicker={datePicker}/>
          <LoadingModal refreshing={refreshing} />
        </DashboardLayout>      
      </div>
    </>
  )
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false })