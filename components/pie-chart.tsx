import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Asset Allocations',
    },
  },
};

export default function PieChart({ data }) {
  
  if(!data?.snapshot || Object.keys(data.snapshot).length <= 0) return null
  let array = []
  let i = 0
  Object.keys(data.snapshot).filter((key, value) => {
    if(data.snapshot[key] > 0){
      array.push({ label: key, value: data.snapshot[key], color: colors[i]})
      i++
    }
  })

  return <Pie data={{
    labels: array.map(a => a.label),
    datasets: [
      {
        label: 'Asset Allocation',
        data: array.map(a => a.value),
        backgroundColor: array.map(a => a.color)
      },
    ],
  }} options={options}/>
}
