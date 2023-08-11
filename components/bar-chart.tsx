import React, { useState, useEffect } from 'react'
import { classNames } from '../lib/lodash'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const tabs = [
  { name: 'Monthly View', key: 'monthly' },
  { name: 'Weekly View', key: 'weekly' },
]

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: false,
      text: 'Monthly Expense & Income',
    },
  },
};

export default function ({ graphData }) {
  const { groupByMonthIncome, groupByMonth, groupByWeek } = graphData
  if (!groupByMonthIncome || !groupByMonth) return null
  if (groupByMonthIncome.length < 1 && groupByMonth.length < 1) return null

  const [key, updateKey] = useState('monthly')
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    if(key === 'monthly'){
      updateBar(groupByMonth, key)
    } else {
      updateBar(groupByWeek, key)
    }
  }, [groupByMonth, key])

  const updateBar = (expenses, key) => {
    const monthlySum = groupByMonthIncome.map(a => Math.abs(a._sum.amount))
    const labels = key === 'monthly' ? expenses.map(a => a.month_year) : expenses.map(a => a.week_year)
    const sums = expenses.map(a => Math.abs(a._sum.amount))

    if(key === 'weekly' || monthlySum <= 0){
      setData({
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Expenses',
            data: sums.reverse(),
            backgroundColor: '#ff6384'
          }
        ],
      })
    } else {
      setData({
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Income',
            data: monthlySum.reverse(),
            backgroundColor: '#009c7b'
          },{
            label: 'Expenses',
            data: sums.reverse(),
            backgroundColor: '#ff6384'
          }
        ],
      })
    }
  }

  return (
    <>
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
      <Bar options={options} data={data} />
    </>
  )
  
}
