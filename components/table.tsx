import React, { useState, useEffect } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon, ChatBubbleOvalLeftIcon, BellAlertIcon } from '@heroicons/react/20/solid'
import { snakeCase } from "snake-case"
import { CSVLink } from "react-csv";
import { DateTime } from "luxon";
import { addComma } from '../lib/formatNumber'
import { Emoji } from 'emoji-picker-react'
import EmojiModal from './emoji-modal'
import PinkBtn from './pink-btn'

export default function ({ columns, data, selected, setSelected, setEdit }) {
  if (!data || !columns) return null
  const today = DateTime.now().toFormat('yyyy-LL-dd')
  const [sum, setSum] = useState('')
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
  
  const downloadCSV = () => {
    let arr = [['Name', 'Primary Category', 'Detailed Category', 'Date', 'Amount', 'Account Name', 'Notes']]
    rows.forEach(r => (
      arr.push([r.original.name, r.original.primary_category, r.original.detailed_category, r.original.date, r.original.amount, r.original.account_name, r.original.notes])
    ))
    updateCSV(arr)
    return true
  }

  useEffect(() => {
    let total = 0
    rows.map((row) => {
      total += Number(row.values.amount)
    })
    setPagination({start: 0, end: 20})
    setSum(addComma(total))
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
          <>
            <button className="mr-2 mt-6" onClick={() => setShowEmoji(true)}>
              <Emoji unified={emoji} />
            </button>
            { emoji !== '1f50d' && <p onClick={removeEmoji} className="text-xs font-gray-300 font-extralight">Remove</p>}
          </>
        )
      case 'Amount':
        return (
          <>
            <div className="flex">
              <p className="font-bold">{column.render("Header")}</p>
              <span className="ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                <ChevronDownIcon
                  {...column.getHeaderProps(column.getSortByToggleProps())} 
                  className="h-5 w-5" 
                  aria-hidden="true"
                />
              </span>
            </div>
            <p className="text-lg font-semibold text-pink-600">{sum}</p>
          </>
        )
      case 'Download':
        return (
          <CSVLink onClick={downloadCSV} filename={`trckfi-data-${today}.csv`} data={csv}>
            <PinkBtn onClick={() => {}}>
              Download
            </PinkBtn>
            <p className="text-xs font-gray-300 font-extralight pt-2">({rows.length} filtered)</p>
          </CSVLink>
        )
      default:
        return (
          <>
            <div className="flex">
              <p className="font-bold">{column.render("Header")}</p>
              <span className="ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                <ChevronDownIcon 
                  {...column.getHeaderProps(column.getSortByToggleProps())} 
                  className="h-5 w-5" 
                  aria-hidden="true"
                />
              </span>
            </div>
            <input                          
              onChange={(e) => setFilter(snakeCase(column.render("Header")), e.target.value)}
              placeholder={`Filter ${column.render("Header")}`}
              className="w-full font-normal rounded p-2 my-4 focus:outline-none pink-border"
            />
          </>
        )
    }    
  }

  return (
    <>
      <div className="absolute pb-12 flex h-12 items-center space-x-3">
        <PinkBtn onClick={() => setEdit({
            name: null,
            primary_category: null,
            detailed_category: null,
            amount: null,
            notes: null,
            unified: '1f50d',
            new: true
          }
        )}>
          Add Transaction
        </PinkBtn>
        {selected.length > 0 &&
          <PinkBtn onClick={() => setEdit({
              name: null,
              primary_category: null,
              detailed_category: null,
              amount: null,
              notes: null,
              unified: '1f50d',
            }
          )}>
            Bulk edit
          </PinkBtn>
        }
      </div>
      <EmojiModal open={showEmoji} setOpen={setShowEmoji} searchEmoji={searchEmoji}/>
      <div className="w-full mt-4 overflow-scroll sm:overflow-auto">
        <table className="lg:table-auto sm:table-fixed  w-full divide-y divide-gray-300 mt-4" {...getTableProps()}>
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
                    if(cell.column.Header === 'Amount' && cell.value > 0){
                      return (<td className="overflow-hidden px-1 py-2 text-sm font-semibold text-green-600" {...cell.getCellProps()}>{cell.render("Cell")}</td>);
                    } else if (cell.column.Header === 'Name'){
                      return (
                        <td className="overflow-hidden px-1 py-2 text-sm text-gray-500 flex items-center" {...cell.getCellProps()}>
                          {cell.render("Cell")} 
                          { cell.row.original.notes && <ChatBubbleOvalLeftIcon className="h-5 w-5 ml-3" /> }
                          { cell.row.original.alert_date && <BellAlertIcon className="h-5 w-5 ml-3 text-red-400" /> }
                        </td>
                      )
                    } else {
                      return (<td className="overflow-hidden px-1 py-2 text-sm text-gray-500" {...cell.getCellProps()}>{cell.render("Cell")}</td>);
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
