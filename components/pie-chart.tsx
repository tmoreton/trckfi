import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
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

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        '#36a2eb',
        '#9ad0f5',
        '#ff6384',
        '#ffb1c1',
        '#4bc0c0',
        '#a5dfdf',
      ],
      borderColor: [
        '#36a2eb',
        '#9ad0f5',
        '#ff6384',
        '#ffb1c1',
        '#4bc0c0',
        '#a5dfdf',
      ],
      borderWidth: 1,
    },
  ],
};

export default function PieChart({ user }) {
  const [initialInput, setPrompt] = useState(null)

  useEffect(() => {
    getPieChart()
  }, [])

  const getPieChart = async () => {
    const res = await fetch(`/api/get_net_worth_graph`, {
      body: JSON.stringify({
        user,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
  }

  return <Pie data={data} />
}
