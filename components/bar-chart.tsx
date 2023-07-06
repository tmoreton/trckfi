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

export const options = {
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      }
    }
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

export default function ({ monthlyIncomeData, monthlyExpenseData }) {
  if (monthlyIncomeData.length <= 0 || monthlyExpenseData.length <= 0) return null

  const monthlyLabel = monthlyExpenseData.map(a => a.dt_string)
  const monthlySum = monthlyIncomeData.map(a => Math.abs(a._sum.amount))
  const monthlyExpenseSum = monthlyExpenseData.map(a => Math.abs(a._sum.amount))

  const data = {
    labels: monthlyLabel,
    datasets: [
      {
        label: 'Income',
        data: monthlySum,
        backgroundColor: '#009c7b'
      }, {
        label: 'Expense',
        data: monthlyExpenseSum,
        backgroundColor: '#ff6384'
      },
    ],
  }
  console.log(data)
  return <div className="sm:w-2/3 w-100 mx-auto mt-8 p-0 sm:pl-28"><Bar options={options} data={data} /></div>
}
