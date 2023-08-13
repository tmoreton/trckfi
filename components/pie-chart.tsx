import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

const category_colors = {
  auto: { color: '#9966ff', name: 'Automobile'},
  cash: { color: '#4bc0c0', name: 'Cash' },
  crypto: { color: '#9ad0f5', name: 'Cryptocurrency' },
  other: { color: '#ffb1c1', name: 'Other' },
  real_estate: { color: '#ff6384', name: 'Real Estate' },
  retirement: { color: '#36a2eb', name: 'Retirement' },
  stocks: { color: '#ffcd56', name: 'Stocks' },
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Current Asset Allocations',
    },
  },
};

export default function PieChart({ data }) {
  
  if(!data?.snapshot || Object.keys(data.snapshot).length <= 0) return null
  let array = []
  let i = 0
  Object.keys(data.snapshot).filter((key, value) => {
    if(data.snapshot[key] > 0){
      array.push({ label: category_colors[key].name, value: data.snapshot[key], color: category_colors[key].color})
      i++
    }
  })

  return <Pie data={{
    labels: array.map(a => a.label),
    datasets: [
      {
        label: 'Current Asset Allocation',
        data: array.map(a => a.value),
        backgroundColor: array.map(a => a.color)
      },
    ],
  }} options={options}/>
}
