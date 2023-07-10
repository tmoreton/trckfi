import { useState, useEffect } from 'react'
import BarChart from './bar-chart'
import { addComma, classNames } from '../lib/formatNumber'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Emoji } from 'emoji-picker-react';

const colors = [
  '#36a2eb',
  '#9ad0f5',
  '#ff6384',
  '#ffb1c1',
  '#4bc0c0',
  '#a5dfdf',
  '#ffcd56',
  '#ffe19a',
  '#9966ff',
  '#b199e7',
  '#bdb2db',
  '#c9cbcf'
]

const tabs = [
  { name: 'Primary Categories', key: 'primary_category' },
  { name: 'Detailed Categories', key: 'detailed_category' },
  { name: 'Emoji Categories', key: 'unified' },
]

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ({ categories, detailedCategories, incomeData, expenseData, weeklyData, emojiCategories }) {
  if (!categories) return null
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })
  const [filtered, setFiltered] = useState([])
  const [sum, setSum] = useState(0)
  const [key, updateKey] = useState('primary_category')

  useEffect(() => {
    if(key === 'primary_category'){
      updatePie(categories)
    } else if(key === 'unified') {
      updatePie(emojiCategories)
    } else {
      updatePie(detailedCategories)
    }
  }, [categories, key])

  const updatePie = (categories) => {
    let total = 0
    let updated = categories.map((a, i) => {
      total += Number(a._sum.amount)
      return {
        name: a.primary_category || a.detailed_category || a.unified,
        color: colors[i],
        amount: a._sum.amount
      }
    }).sort((a,b) => b.amount - a.amount)
    setSum(total)
    setFiltered(updated)
    setData({
      labels: updated.map(e => e.name),
      datasets: [
        {
          data: updated.map(e => e.amount),
          backgroundColor: updated.map(e => e.color),
        },
      ],
    })
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Categories',
      },
    },
  }

  return (
    <div>        
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 py-10">
        <div className="col-span-1 px-4 pb-4 shadow-sm sm:px-6 sm:pt-2 rounded-md border border-gray-200">
          <div>
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-pink-500 focus:outline-none focus:ring-pink-500 sm:text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => updateKey(tab.key)}
                      className={classNames(
                        tab.key === key
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                      )}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>


          <div className="gap-x-8 grid grid-cols-1 lg:grid-cols-2">
            <div className="col-span-1">
              { filtered.map(i => {
                console.log(i)
                return (
                  <>
                    <div className="flex justify-between pt-2 pb-1 text-xs text-gray-500">
                      {
                        key === 'unified' ?
                        <Emoji unified={i.name} size={20}/>
                        :
                        <p>{i?.name?.split('_').join(' ')}</p>
                      }
                      <p className="font-semibold">{addComma(i.amount)}</p>
                    </div>
                    <div className="mb-2 w-full bg-white rounded h-1">
                      <div className="h-1 rounded" style={{width: `${Number(i.amount)/sum*100}%`, backgroundColor: i.color}}></div>
                    </div>
                  </>
                )
              })}
            </div>
            <div className="col-span-1">
              <Doughnut data={data} options={options}/>
            </div>
          </div>
        </div>
        <div className="col-span-1 px-4 pb-4 shadow-sm sm:px-6  sm:pt-2 rounded-md border border-gray-200">
          <BarChart monthlyIncomeData={incomeData} monthlyExpenseData={expenseData} weeklyData={weeklyData}/>
        </div>
      </div>
    </div>
  )
}
