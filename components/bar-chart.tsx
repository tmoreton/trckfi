import React from 'react';
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

export default function ({ monthlyIncomeData, monthlyExpenseData }) {
  if (!monthlyIncomeData || !monthlyExpenseData) return null
  if (monthlyIncomeData.length < 1 && monthlyExpenseData.length < 1) return null

  const monthlyLabel = monthlyExpenseData.map(a => a.month_year)
  const monthlySum = monthlyIncomeData.map(a => Math.abs(a._sum.amount))
  const monthlyExpenseSum = monthlyExpenseData.map(a => Math.abs(a._sum.amount))
  // const options = {
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false
  //       }
  //     },
  //     y: {
  //       grid: {
  //         display: false
  //       }
  //     }
  //   },
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'bottom',
  //     },
  //   },
  // }

  let data = {
    labels: monthlyLabel.reverse(),
    datasets: [
      {
        label: 'Income',
        data: monthlySum.reverse(),
        backgroundColor: '#009c7b'
      }, {
        label: 'Expenses',
        data: monthlyExpenseSum.reverse(),
        backgroundColor: '#ff6384'
      },
    ],
  }
  
  if(monthlyIncomeData.length <= 0){
    data = {
      labels: monthlyLabel,
      datasets: [
        {
          label: 'Expenses',
          data: monthlyExpenseSum,
          backgroundColor: '#ff6384'
        },
      ],
    }
  }
  return <div className="sm:w-2/3 w-100 mx-auto mt-8 p-0 sm:pl-28"><Bar data={data} /></div>
}
