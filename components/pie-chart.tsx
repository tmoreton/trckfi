import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

ChartJS.register(ArcElement, Tooltip, Legend);

const capitalize = (string) => {
  let str = string.split('_').join(' ').toLowerCase()
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        pointStyle: 'circle',
        padding: 15,
        font: {
          padding: 5,
          size: 10
        }
      }
    },
  },
}

export default function ({ pieData }) {
  const labels = pieData.map(a => capitalize(a.primary_category))
  const sums = pieData.map(a => Math.abs(a._sum.amount))
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Categories',
        data: sums,
        backgroundColor: [
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
        ],
        borderColor: [
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
        ],
        borderWidth: 1,
      },
    ],
  }
  return <div className='sm:w-1/3 w-100 mx-auto mt-8'><Pie options={options} data={data} /></div>
}