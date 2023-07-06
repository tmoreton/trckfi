import React, { useState, useEffect } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { snakeCase } from "snake-case"

export default function ({ columns, data }) {
  if (!data || !columns) return null

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
  );

  useEffect(() => {
    let total = 0
    rows.map((row) => {
      total += Number(row.values.amount)
    })
    let num = Number(Math.abs(total)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    setPagination({start: 0, end: 20})
    setSum(num)
  }, [rows])

  const updatePagination = (type) => {
    if(type === 'PREVIOUS' && paginate.end > 20){
      setPagination({start: paginate.start-20, end: paginate.end-20})
    }
    if (type === 'NEXT' && rows.length >= paginate.end) {
      setPagination({start: paginate.start+20, end: paginate.end+20})
    }
  };

  return (
    <>
      <div className="mt-10 flex justify-center gap-x-6 items-center">
        <div className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-lg font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-pink-600 text-white hover:bg-pink-500 focus-visible:outline-pink-900">
          <p className="text-md mr-2">Total:</p>
          <p className="text-2xl font-bold">${sum}</p>
        </div>
          
      </div>
      <div className="w-full mt-4 overflow-scroll sm:overflow-auto">
        <table className="table-fixed sm:table-auto w-full divide-y divide-gray-300 mt-4" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={column.render("style")}>
                    <div className="flex">
                      <p className="font-bold">{column.render("Header")}</p>
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
                      { column.render("Header") !== '' &&
                        <input                          
                          onChange={(e) => setFilter(snakeCase(column.render("Header")), e.target.value)}
                          placeholder={`Filter ${column.render("Header")}`}
                          className="w-full font-normal rounded p-2 my-4 focus:outline-none pink-border"
                        />
                      }
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
                    if(cell.column.Header === 'Name'){
                      return (
                        <td className="overflow-hidden px-2 py-2 text-sm text-gray-500" {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    } else {
                      return (
                        <td className="overflow-hidden px-2 py-2 text-sm text-gray-500" {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
