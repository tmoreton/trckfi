import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { addComma } from '../lib/formatNumber'

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}
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

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ({ categories }) {
  if (!categories) return null

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

  let sum = 0
  const filtered = categories.map((a, i) => {
    sum += Number(a._sum.amount)
    return {
      name: a.primary_category || a.detailed_category,
      color: colors[i],
      amount: a._sum.amount
    }
  })
  filtered.sort((a,b) => b.amount - a.amount)

  const data = {
    labels: filtered.map(e => e.name),
    datasets: [
      {
        data: filtered.map(e => e.amount),
        backgroundColor: filtered.map(e => e.color),
      },
    ],
  }

  return (
    <>
      <div className="w-1/4">
      { filtered.map(i => {
        return (
          <>
            <div className="flex justify-between pt-2 pb-1 text-xs text-gray-500">
              <p >{i.name.split('_').join(' ')}</p>
              <p className="font-semibold">{addComma(i.amount)}</p>
            </div>
            <div className="mb-2 w-full bg-white rounded h-1">
              <div className="h-1 rounded" style={{width: `${Number(i.amount)/sum*100}%`, backgroundColor: i.color}}></div>
            </div>
          </>
        )
      })}
      </div>
      <div className='sm:w-1/4 w-100 mx-auto mt-8 ml-4'>
        <Doughnut data={data} options={options}/>
      </div>   
    </>
  )
}