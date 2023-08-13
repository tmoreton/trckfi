import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { DateTime } from "luxon"

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const category_colors = {
    auto: { color: '#9966ff', name: 'Automobile'},
    cash: { color: '#4bc0c0', name: 'Cash' },
    crypto: { color: '#9ad0f5', name: 'Cryptocurrency' },
    other: { color: '#ffb1c1', name: 'Other' },
    real_estate: { color: '#ff6384', name: 'Real Estate' },
    retirement: { color: '#36a2eb', name: 'Retirement' },
    stocks: { color: '#ffcd56', name: 'Stocks' },
  }

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Net Worth History',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
  export default function ({ history }) {
    const data = {
      labels: history.map(i => DateTime.fromISO(i.created_at).toFormat('MMMM')),
      datasets: [
        {
          label: category_colors.auto.name,
          data: history.map(i => i.snapshot.auto),
          borderColor:  category_colors.auto.color,
          backgroundColor: category_colors.auto.color,
        },
        {
          label: category_colors.cash.name,
          data: history.map(i => i.snapshot.cash),
          borderColor:  category_colors.cash.color,
          backgroundColor: category_colors.cash.color,
        },
        {
          label: category_colors.crypto.name,
          data: history.map(i => i.snapshot.crypto),
          borderColor:  category_colors.crypto.color,
          backgroundColor: category_colors.crypto.color,
        },
        {
          label: category_colors.other.name,
          data: history.map(i => i.snapshot.other),
          borderColor:  category_colors.other.color,
          backgroundColor: category_colors.other.color,
        },
        {
          label: category_colors.real_estate.name,
          data: history.map(i => i.snapshot.real_estate),
          borderColor:  category_colors.real_estate.color,
          backgroundColor: category_colors.real_estate.color,
        },
        {
          label: category_colors.retirement.name,
          data: history.map(i => i.snapshot.retirement),
          borderColor:  category_colors.retirement.color,
          backgroundColor: category_colors.retirement.color,
        },
        {
          label: category_colors.stocks.name,
          data: history.map(i => i.snapshot.stocks),
          borderColor:  category_colors.stocks.color,
          backgroundColor: category_colors.stocks.color,
        },
      ],
    };
    return <Line options={options} data={data} />;
  }
  