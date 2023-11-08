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
  plugins: {
    title: {
      display: true,
      text: '',
    },
    legend: {
      position: 'bottom' as const,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

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
export default function ({ rows }) {
  let datasets = []
  // @ts-ignore
  const grouped_by_date = Object.groupBy(rows, (t) => t?.original?.month_year)
  const labels = Object.keys(grouped_by_date)
  // @ts-ignore
  const grouped_by_category = Object.groupBy(rows, (t) => t?.original?.detailed_category)
  const detailed_category = Object.keys(grouped_by_category)


  datasets = detailed_category.map((e, key) => {
    let arr = []
    grouped_by_category[e].map(t => {
      if(t.original && t.original.detailed_category === e){
        arr.push(t.original.amount)
      }
      arr.push(0)
    })
    return {
      label: e,
      data: arr,
      backgroundColor: colors[key]
    }
  })

  console.log(datasets)

  return <Bar options={options} data={{
    labels: labels.reverse(),
    datasets
  }} />;
}
