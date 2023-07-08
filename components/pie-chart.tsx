import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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
        display: true,
        text: 'Categories',
      },
    },
  }

  const filtered = categories.map((a, i) => {
    return {
      category: a.primary_category || a.detailed_category,
      color: colors[i],
      amount: a._sum.amount
    }
  })

  const data = {
    labels: filtered.map(e => e.category),
    datasets: [
      {
        data: filtered.map(e => e.amount),
        backgroundColor: filtered.map(e => e.color),
      },
    ],
  }

  return (
    <>
      <div className="w-full">
      { filtered.map(() => {
        return (
          <div className=" my-4 w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-pink-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
          </div>
        )
      })}
      </div>
      <div className='sm:w-1/3 w-100 mx-auto mt-8 ml-4'>
        <Doughnut data={data} options={options}/>
      </div>   
    </>
  )
}