import { useState, useEffect } from 'react'
import BarChart from './bar-chart'
import { addComma, classNames } from '../lib/lodash'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Emoji } from 'emoji-picker-react';
import { DateTime } from "luxon"
import { FaceFrownIcon } from '@heroicons/react/20/solid'

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
  { name: 'Primary Category', key: 'primary_category' },
  { name: 'Detailed Category', key: 'detailed_category' },
]

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ({ graphData }) {
  const { categories, detailedCategories } = graphData
  if (!categories) return null
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })
  const [filtered, setFiltered] = useState([])
  const [sum, setSum] = useState(0)
  const [key, updateKey] = useState('primary_category')
  const [current, updateMonth] = useState({
    year: DateTime.now().toFormat('yyyy'),
    name: DateTime.now().toFormat('MMM'),
    month_year: DateTime.now().toFormat('yyyy-MM')
  })
  const [months, setMonths] = useState([])
  const [type, setType] = useState('month_year')

  useEffect(() => {
    getMonths()
  }, [])

  useEffect(() => {
    if(key === 'primary_category'){
      updatePie(categories, type)
    } else {
      updatePie(detailedCategories, type)
    }
  }, [categories, key, current, type])

  const getMonths = () => {
    let x = 0
    let six_months = []
    while(x < 6){
      let dt = DateTime.now().minus({months: x})
      six_months.push({
        name: dt.toFormat('MMM'),
        month_year: dt.toFormat('yyyy-MM'),
        year: dt.toFormat('yyyy')
      })
      x++
    }
    setMonths(six_months.reverse())
  }

  const updatePie = (categories, type) => {
    let total = 0
    let cats;
    if(type === 'month_year'){
      cats = categories.filter(i => i.month_year === current.month_year)
    } else {
      cats = categories.filter(i => i.year === current.year)
    }
    console.log(cats)
    let sorted = cats.sort((a,b) => a._sum.amount - b._sum.amount)
    let mapped = sorted.map((a, i) => {
      return {
        name: a.primary_category || a.detailed_category || a.unified,
        color: colors[i],
        amount: a._sum.amount,
      }
    })
    mapped = mapped.slice(0, 8)

    let filtered = mapped.filter((a) => {
      total += Number(a.amount)
      if(Number(a.amount) < 0) return a
    })
    setSum(total)
    setFiltered(filtered)

    setData({
      labels: filtered.map(e => e.name),
      datasets: [
        {
          data: filtered.map(e => e.amount),
          backgroundColor: filtered.map(e => e.color),
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
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-2 md:pb-12 pb-2">
        <div className="pie-step col-span-1 px-4 pb-4 shadow-sm sm:px-6 sm:pt-2 rounded-md border border-gray-200 lg:mb-0 mb-6">
          <div className="border-b border-gray-200 mb-1">
              <nav className="-mb-px flex" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => updateKey(tab.key)}
                    className={classNames(
                      tab.key === key
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium w-1/2'
                    )}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex justify-between" aria-label="Tabs">
                {/* <button
                  onClick={() => setType('year')}
                  className={classNames(
                    'This Year' === current.name
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                  )}
                >
                  This Year
                </button> */}
                {months.map((month) => (
                  <button
                    key={month.name}
                    onClick={() => updateMonth(month)}
                    className={classNames(
                      month.name === current.name
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                    )}
                  >
                    {month.name}
                  </button>
                ))}
              </nav>
          </div>
          {
            data?.labels?.length > 0 ?
            <div className="gap-x-8 grid grid-cols-1 lg:grid-cols-2">
              <div className="col-span-1">
                { filtered.map(i => {
                  return (
                    <>
                      <div className="flex justify-between pb-1 text-xs text-gray-500">
                        {
                          key === 'unified' ?
                          <Emoji unified={i.name} size={20}/>
                          :
                          <p>{i?.name?.split('_').join(' ').slice(0, 22)}</p>
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
              <div className="col-span-1 hidden md:block">
                <Doughnut data={data} options={options}/>
              </div>
            </div>
            :
            <div className="text-gray-400 w-full text-center">
              <FaceFrownIcon className="h-20 w-20 mx-auto"/>
              <p className="text-xl font-semibold">No data for this month yet</p>
            </div>
          }
        </div>
        <div className="bar-step col-span-1 px-4 pb-4 shadow-sm sm:px-6 sm:pt-2 rounded-md border border-gray-200 hidden md:block">
          <BarChart graphData={graphData} />
        </div>
      </div>
    </div>
  )
}
