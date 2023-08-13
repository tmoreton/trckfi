import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ user }) {
  const [netWorth, setNetWorth] = useState([])
  
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
    setNetWorth(data)
  }

  if(netWorth.length <= 0) return null
  return <Pie data={{
    labels: netWorth.map(i => i.type),
    datasets: [
      {
        label: 'Net Worth Allocation',
        data: netWorth.map(i => i.amount),
        backgroundColor: netWorth.map(i => i.color)
      },
    ],
  }} />
}
