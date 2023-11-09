import React, { useState, useEffect } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { PlusCircleIcon, ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon, ChatBubbleOvalLeftIcon, BellAlertIcon, ArrowPathIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import { CSVLink } from "react-csv";
import { DateTime } from "luxon";
import { addComma } from '../lib/lodash'
import { Emoji } from 'emoji-picker-react'
import EmojiModal from './modals/emoji-modal'
import { InverseBtn } from './pink-btn'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import BarChart from '../pages/transactions/bar-chart'

export default function ({ user, columns, data, selected, setSelected, setEdit, datePicker, setShowImport }) {
  if (!data || !columns) return null
  const today = DateTime.now().toFormat('yyyy-LL-dd')
  const [total, setSum] = useState({
    sum: 0,
    income: 0,
    expenses: 0
  })
  const [count, setCount] = useState(0)
  const [showEmoji, setShowEmoji] = useState(false)
  const [emoji, setEmoji] = useState('1f50d')
  const [csv, updateCSV] = useState([])
  const [paginate, setPagination] = useState({
    start: 0,
    end: 20
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter
  } = useTable(
    {
      columns,
      data
    },
    useFilters,
    useSortBy,
  )

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const downloadCSV = () => {
    let arr = [['Name', 'Account Name', 'Primary Category', 'Detailed Category', 'Date', 'Amount', 'Notes']]
    rows.forEach(r => (
      arr.push([r.original.name, r.original.account?.name, r.original.primary_category, r.original.detailed_category, r.original.date, r.original.amount, r.original.notes])
    ))
    updateCSV(arr)
    return true
  }

  useEffect(() => {
    if(rows.length !== count){
      let total = 0
      let expenses = 0
      let income = 0
      rows.map((row) => {
        if(row.values.amount > 0){
          income += Number(row.values.amount)
        }
        if(row.values.amount < 0){
          expenses += Number(row.values.amount)
        }
        total += Number(row.values.amount)
      })
      setPagination({start: 0, end: 20})
      setSum({
        sum: total,
        expenses,
        income
      })
      setCount(rows.length)
    }
  }, [rows])


  const updatePagination = (type) => {
    if(type === 'PREVIOUS' && paginate.end > 20){
      setPagination({start: paginate.start-20, end: paginate.end-20})
    }
    if (type === 'NEXT' && rows.length >= paginate.end) {
      setPagination({start: paginate.start+20, end: paginate.end+20})
    }
  }

  const searchEmoji = (e) => {
    console.log(e)
    setFilter('unified', e)
    setShowEmoji(false)
    setEmoji(e)
  }

  const removeEmoji = () => {
    setFilter('unified', '')
    setEmoji('1f50d')
  }

  const renderHeader = (column) => {
    switch (column.render("Header")) {
      case 'sort':
        return (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 mt-6"
            onChange={(e) => e.target.checked ? setSelected(rows.map((r) => r?.values?.id)) : setSelected([])}
          />
        )
      case 'unified':
        return (
          <div className="min-w-[50px]">
            <button className="w-7 h-5 mt-6 ml-2" onClick={() => setShowEmoji(true)}>
              <Emoji unified={emoji} />
            </button>
            { emoji !== '1f50d' && <button onClick={removeEmoji} className="text-xs font-gray-300 font-extralight">Remove</button>}
          </div>
        )
      case 'Download': return null
      default:
        return (
          <>
            <div className="flex" {...column.getHeaderProps(column.getSortByToggleProps())} >
              <p className="font-bold text-sm">{column.render("Header")}</p>
              <span className="ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
            <div>{column.canFilter ? column.render("Filter") : null}</div>
            
            {/* <input
              onChange={(e) => setFilter(column.id, e.target.value)}
              placeholder={`Filter ${column.render("Header")}`}
              className="w-full font-normal rounded p-2 my-4 focus:outline-none pink-border"
              value={column.filterValue}
            /> */}
          </>
        )
    }    
  }
  return (
    <>
      <EmojiModal open={showEmoji} setOpen={setShowEmoji} searchEmoji={searchEmoji}/>
      <div className="flex h-12 items-center space-x-3 justify-center pb-6">
        { !selected.length && datePicker()}
        <div>
        { selected.length ?
          <InverseBtn type="button" onClick={() => setEdit({
              name: null,
              primary_category: null,
              detailed_category: null,
              amount: null,
              notes: null,
              unified: '1f50d',
            }
          )}>
            Bulk Edit
            <span className="text-xs font-gray-300 font-extralight pl-1">({selected.length} items)</span>
          </InverseBtn>
          :
          <Menu as="div" className="relative ml-3">
            <Menu.Button className="flex items-center">
              <span className="sr-only">Open user menu</span>
              <PlusCircleIcon className="h-12 w-12 text-pink-600" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setEdit({
                        name: null,
                        primary_category: null,
                        detailed_category: null,
                        amount: null,
                        notes: null,
                        unified: '1f50d',
                        new: true
                      })}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                      )}
                    >
                        Add Transaction
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowImport(true)}
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                      )}
                    >
                        Import Data
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700 w-full text-left'
                      )}
                    >
                      <CSVLink onClick={downloadCSV} filename={`trckfi-data-${today}.csv`} data={csv}>
                        Download CSV
                      </CSVLink>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        }
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-x-8 lg:mx-0 lg:max-w-none py-2">
        <div className="col-span-3 px-3 shadow-sm rounded-md border border-gray-200">
          <BarChart rows={rows}/>
        </div>
        <div className="col-span-1 shadow-sm rounded-md border border-gray-200">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8 rounded-md">
            <p className="text-md font-medium leading-6 text-gray-500">Cash Flow</p>
            <p className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-gray-900">
              {addComma(total.sum)}
            </p>
          </div>
          <div className="px-5"><hr /></div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8 rounded-md">
            <p className="text-md font-medium leading-6 text-gray-500">Income</p>
            <p className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-green-600">
              {addComma(total.income)}
            </p>
          </div>
          <div className="px-5"><hr /></div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-8 sm:px-6 xl:px-8 rounded-md">
            <p className="text-md font-medium leading-6 text-gray-500">Expenses</p>
            <p className="w-full flex-none text-3xl font-bold leading-10 tracking-tight text-red-600">
              {addComma(total.expenses)}
            </p>
          </div>
          <div className="px-5"><hr /></div>
          <div className="gap-x-4 gap-y-2 bg-white px-4 py-5 sm:px-6 xl:px-8 rounded-md">
            <p className="text-md font-medium leading-6 text-gray-900">{rows.length} Transactions</p>
          </div>
        </div>
      </div>

      <div className="w-full overflow-scroll sm:overflow-auto transaction-step">
        <table className="lg:table-auto sm:table-fixed w-full divide-y divide-gray-300 mt-4" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={column.render("style")}>
                    {renderHeader(column)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white" {...getTableBodyProps()}>
            {rows.slice(paginate.start, paginate.end).map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    if (cell.column.Header === 'Name'){
                      return (
                        <td className="overflow-hidden px-1 py-2 text-xs text-gray-500" {...cell.getCellProps()}>
                          <span className="flex" >{cell.render("Cell")} 
                          { cell.row.original.notes && <ChatBubbleOvalLeftIcon className="h-4 w-4 ml-3" /> }
                          { cell.row.original.recurring && <ArrowPathIcon className="h-4 w-4 ml-3" /> }
                          { cell.row.original.user_id !== user.id && <UserCircleIcon className="h-4 w-4 ml-3" /> }
                          { cell.row.original.alert_date && <BellAlertIcon className="h-4 w-4 ml-3 text-red-400" /> }
                          </span>
                        </td>
                      )
                    } else {
                      return (
                        <td className={classNames(
                          cell.column.Header === 'Date'
                            ? 'min-w-[125px]'
                            : '',
                          'overflow-hidden px-1 py-2 text-xs text-gray-500'
                          )} {...cell.getCellProps()}>{cell.render("Cell")}
                        </td>
                      );
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <nav className="flex items-center justify-between px-4 sm:px-0 mt-4">
        <div className="flex w-0 flex-1">
          <button
            onClick={() => updatePagination('PREVIOUS')}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            Previous
          </button>
        </div>
        <div className="flex w-0 flex-1 justify-end">
          <button
            onClick={() => updatePagination('NEXT')}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </>
  );
}
