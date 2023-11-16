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
      // grid: {
      //   display: false
      // }
    },
    y: {
      stacked: true,
      // grid: {
      //   display: false
      // }
    },
  },
};

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
export default function ({ rows }) {
  let income_array = []
  let expense_array = []

  let sorted = rows.sort((a,b) => {
    // @ts-ignore
    return new Date(b.original.date) - new Date(a.original.date);
  });

  let grouped_by_date = []
  let labels = []
  if(sorted){
    // @ts-ignore
    grouped_by_date = Object?.groupBy(sorted, (t) => {
      let arr = t?.original?.month_year?.split('-')
      return `${months[arr[1]]} ${arr[0]}`
    })
    labels = Object.keys(grouped_by_date)

    Object?.keys(grouped_by_date).forEach(row => {
      let income = 0
      let expense = 0
      grouped_by_date[row].forEach(i => {
        if(i.original.amount > 0){
          income += Number(i.original.amount)
        } else {
          expense += Number(i.original.amount)
        }
      })
      income_array.push(income)
      expense_array.push(expense)
    })
  }

  return <Bar options={options} data={{
    labels: labels.reverse(),
    datasets: [
      {
        label: 'Income',
        data: income_array.reverse(),
        backgroundColor: '#009c7b'
      },{
        label: 'Expenses',
        data: expense_array.reverse(),
        backgroundColor: '#ff6384'
      }
    ],
  }} />;
}
