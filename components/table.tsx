import React, { useState, useEffect } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { snakeCase } from "snake-case"
import { CSVLink } from "react-csv";
import { DateTime } from "luxon";
import { addComma } from '../lib/formatNumber'
import EmojiPicker from 'emoji-picker-react'
import { Emoji } from 'emoji-picker-react'

export default function ({ columns, data }) {
  if (!data || !columns) return null
  const today = DateTime.now().toFormat('yyyy-LL-dd')
  const [sum, setSum] = useState('')
  const [paginate, setPagination] = useState({
    start: 0,
    end: 20
  });

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

  const renderHeader = (column) => {
    switch (column.render("Header")) {
      case 'unified':
        return (
          <div className="w-6 mr-4">
            <Emoji unified="1f50d" size={30} />
          </div>
        )
      case 'Amount':
        return (
          <div className="w-full my-4 items-center justify-left rounded py-1 pr-4 text-sm font-semibold bg-white ml-0">
            <span className="text-gray-400 text-sm font-normal mr-2">Total: </span>
            <p className="text-lg font-semibold text-pink-600">{sum}</p>
          </div>
        )
      case 'Download':
        return (
          <CSVLink filename={`trckfi-data-${today}.csv`} data={csv}>
            <button className="text-center button rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ">
              Download CSV
              <p className="text-xs font-gray-300 font-extralight">({rows.length} selected)</p>
            </button>
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
      <div className="w-full mt-4 overflow-scroll sm:overflow-auto">
        <table className="table-fixed sm:table-auto w-full divide-y divide-gray-300 mt-4" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={column.render("style")}>
                    {renderHeader(column)}
                    {/* <div className="flex">
                      {
                        hideSearch(column.render("Header")) &&
                        <p className="font-bold">{column.render("Header")}</p>
                      }
                      
                      { column.render("Header") !== '' &&
                        <span className="ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                          <ChevronDownIcon 
                            {...column.getHeaderProps(column.getSortByToggleProps())} 
                            className="h-5 w-5" 
                            aria-hidden="true"
                          />
                        </span>
                      }
                    </div>
                      { hideSearch(column.render("Header")) &&
                        <input                          
                          onChange={(e) => setFilter(snakeCase(column.render("Header")), e.target.value)}
                          placeholder={`Filter ${column.render("Header")}`}
                          className="w-full font-normal rounded p-2 my-4 focus:outline-none pink-border"
                        />
                      }
                      { column.render("Header") === 'unified' &&
                        <Emoji unified="1f50d" size={25} />
                        // <EmojiPicker onEmojiClick={e => console.log(e)}/> 
                      }
                      { column.render("Header") === 'Amount' &&
                        <div className="w-full my-4 inline-flex items-center justify-left rounded py-1 pr-4 text-sm font-semibold bg-white ml-0">
                          <span className="text-gray-400 text-sm font-normal mr-2">Total: </span>
                          <p className="text-lg font-semibold text-pink-600">{sum}</p>
                        </div>
                      }
                      { column.render("Header") === '' &&
                        <CSVLink filename={`trckfi-data-${today}.csv`} data={csv}>
                          <button className="text-center button rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ">
                            Download CSV
                            <p className="text-xs font-gray-300 font-extralight">({rows.length} selected)</p>
                          </button>
                        </CSVLink>
                      } */}
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
                    return (<td className="overflow-hidden py-2 text-sm text-gray-500" {...cell.getCellProps()}>{cell.render("Cell")}</td>);
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
