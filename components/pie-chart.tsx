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

export default function ({ pieChart }) {
  const labels = pieChart.map(a => a.primary_category)
  const sums = pieChart.map(a => a._sum.amount)
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Categories',
        data: sums,
        backgroundColor: [
          CHART_COLORS.red,
          CHART_COLORS.orange,
          CHART_COLORS.yellow,
          CHART_COLORS.green,
          CHART_COLORS.purple,
          CHART_COLORS.grey,
        ],
        borderColor: [
          CHART_COLORS.red,
          CHART_COLORS.orange,
          CHART_COLORS.yellow,
          CHART_COLORS.green,
          CHART_COLORS.purple,
          CHART_COLORS.grey,
        ],
        borderWidth: 1,
      },
    ],
  }
  return <Pie data={data} />;
}