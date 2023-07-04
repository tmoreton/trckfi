import React, { useState, useEffect } from "react"
import { useTable, useFilters, useSortBy } from "react-table"
import { ArrowLongLeftIcon, ArrowLongRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { snakeCase } from "snake-case";

export default function ({ columns, data }) {
  const [filterNameInput, setFilterNameInput] = useState("");
  const [filterCategoryInput, setFilterCategoryInput] = useState("");
  const [filterDetailedInput, setFilterDetailedInput] = useState("");
  const [sum, setSum] = useState('');
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
    let num = Number(Math.abs(total)).toFixed(2)
    setSum(num)
  }, [rows])

  const handleNameFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter('name', value);
    setFilterNameInput(value)
    setPagination({start: 0, end: 20})
  };

  const handleCategoryFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter('primary_category', value);
    setFilterCategoryInput(value)
    setPagination({start: 0, end: 20})
  };

  const handleDetailedFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter('detailed_category', value);
    setFilterDetailedInput(value)
    setPagination({start: 0, end: 20})
  };

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
      <div className="w-full mt-4 overflow-scroll sm:overflow-auto">
        <table className="sm:table-fixed w-full divide-y divide-gray-300 mt-4" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={column.render("style")}>
                    <div className="flex">
                      {column.render("Header")}

                      { column.render("Header") !== '' ?
                        <span className="ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                          <ChevronDownIcon 
                            {...column.getHeaderProps(column.getSortByToggleProps())} 
                            className="h-5 w-5" 
                            aria-hidden="true"
                          />
                        </span>
                        :
                        <div className="block">
                          <p className="text-xs text-gray-400">Total:</p>
                          <p className="text-lg text-pink-600">${sum}</p>
                        </div>
                      }
                    </div>
                    { column.render("Header") === 'Name' &&
                        <input
                          value={filterNameInput}
                          onChange={handleNameFilterChange}
                          placeholder={"Search Name"}
                          className="py-2 mt-2 w-full"
                        />
                      }
                      { column.render("Header") === 'Primary Category' &&
                        <input
                          value={filterCategoryInput}
                          onChange={handleCategoryFilterChange}
                          placeholder={"Search Category"}
                          className="py-2 mt-2 w-full"
                        />
                      }
                      { column.render("Header") === 'Detailed Category' &&
                        <input
                          value={filterDetailedInput}
                          onChange={handleDetailedFilterChange}
                          placeholder={"Search Detailed Category"}
                          className="py-2 mt-2 w-full"
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
