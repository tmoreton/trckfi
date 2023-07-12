import React, { useState, useEffect, useLayoutEffect, useRef } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { snakeCase } from "snake-case"
import { CSVLink } from "react-csv";
import { DateTime } from "luxon";
import { addComma } from '../lib/formatNumber'
import { Emoji } from 'emoji-picker-react'
import EmojiModal from '../components/emoji-modal'

export default function ({ columns, data }) {
  if (!data || !columns) return null
  const today = DateTime.now().toFormat('yyyy-LL-dd')
  const [sum, setSum] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [emoji, setEmoji] = useState('1f50d')
  const [paginate, setPagination] = useState({
    start: 0,
    end: 20
  });
  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      role: 'Member',
    },
  ]
  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  // useLayoutEffect(() => {
  //   const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
  //   setChecked(selectedPeople.length === people.length)
  //   setIndeterminate(isIndeterminate)
  //   checkbox.current.indeterminate = isIndeterminate
  // }, [selectedPeople])

  // function toggleAll() {
  //   setSelectedPeople(checked || indeterminate ? [] : people)
  //   setChecked(!checked && !indeterminate)
  //   setIndeterminate(false)
  // }


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
  let csv = []
  csv.push(headerGroups[0].headers.map((row) => row.Header))
  rows.map((row) => {
    let values = Object.values(row.values)
    values.pop()
    csv.push(values)
  })

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
            className="h-4 w-4 rounded border-gray-300"
            // value={person.email}
            // checked={selectedPeople.includes(person)}
            onChange={(e) => console.log(e.target.checked)}
          />
        )
      case 'unified':
        return (
          <>
            <button className="mr-4" onClick={() => setShowEmoji(true)}>
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
                <ChevronDownIcon removeToken
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
          <CSVLink filename={`trckfi-data-${today}.csv`} data={csv}>
            <button className="text-center button rounded-md bg-pink-600 px-3 py-2 text-base font-semibold text-white shadow-sm">
              Download
            </button>
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
