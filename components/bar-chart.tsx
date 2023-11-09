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
  { name: 'Yearly', key: 'yearly' },
  { name: 'Monthly', key: 'monthly' },
  { name: 'Weekly', key: 'weekly' },
]

const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}

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
  const { groupByMonthIncome, groupByMonth, groupByWeek, groupByYearIncome, groupByYear } = graphData
  if (!groupByMonthIncome || !groupByMonth) return null
  if (groupByMonthIncome.length < 1 && groupByMonth.length < 1) return null

  const [key, updateKey] = useState('monthly')
  const [data, setData] = useState({
    labels: [],
    datasets: []
  })

  useEffect(() => {
    if(key === 'yearly'){
      updateBar(groupByYear, key)
    } else if(key === 'monthly'){
      updateBar(groupByMonth, key)
    } else {
      updateBar(groupByWeek, key)
    }
  }, [groupByMonth, key])

  const updateBar = (expenses, key) => {
    const monthlySum = groupByMonthIncome.map(a => Math.abs(a._sum.amount))
    const yearlySum = groupByYearIncome?.map(a => Math.abs(a._sum.amount))

    let labels;
    if(key === 'monthly'){
      labels = expenses.map(a => months[a.month_year.split('-')[1]])
    } else if (key === 'yearly'){
      labels = expenses.map(a => a.year)
    } else {
      labels = expenses.map(a => a.week_year)
    }
    // const labels = key === 'monthly' ? expenses.map(a => a.month_year) : expenses.map(a => a.week_year)
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
    } else if(key === 'yearly'){
      setData({
        labels: labels.reverse(),
        datasets: [
          {
            label: 'Income',
            data: yearlySum.reverse(),
            backgroundColor: '#009c7b'
          },{
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
      <Bar options={options} data={data} />
    </>
  )
}
