import { useState } from 'react'
import Transactions from "../components/transactions"
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import Plaid from "../components/plaid"
import prisma from '../lib/prisma';
import { getSession, useSession } from "next-auth/react"
import Header from '../components/header'
import Cards from '../components/cards'
import Tokens from '../components/tokens'
import PieChart from '../components/pie-chart'
import BarChart from '../components/bar-chart'
import { DateTime } from "luxon";

export default function ({ thisMonth, lastMonth, thisWeek, lastWeek, accounts, user_id, plaid }) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState({access_token: null, loading: false});

  const getTransactions = async (access_token) => {
    setLoading({access_token: access_token, loading: true})
    await fetch(`/api/get_transactions`, {
      body: JSON.stringify({
        user_id: user_id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setLoading({access_token: null, loading: false})
  }

  const removeToken = async (access_token) => {
    setLoading(true)
    const res = await fetch(`/api/remove_access_token`, {
      body: JSON.stringify({
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setLoading(false)
  }

  if (!session) return (
    <Container>
      <Header/>
      <Preview />
    </Container>
  )

  return (
    <Container>
      <Header/>
      <h1 className="text-3xl md:text-5xl text-base font-bold leading-2 text-gray-900 text-center">My Dashboard</h1>
      
      {/* <div className="py-4">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Accounts</h3>
        <div className="sm:flex sm:items-center justify-items-start">
          <Plaid />
          <Tokens getTransactions={getTransactions} tokens={plaid} removeToken={removeToken} loading={loading}/>
        </div>
      </div> */}
      <div className="py-10">
        <Cards accounts={accounts}/>
      </div>
      <div className="py-10">
        <Snapshot accounts={accounts} thisMonth={thisMonth} lastMonth={lastMonth} thisWeek={thisWeek} lastWeek={lastWeek} />
      </div>
      {/* <div className="grid min-h-full place-items-center py-4">
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="relative flex items-center space-x-3 px-6 py-5">
              <PieChart />
          </div>
          <div className="relative flex items-center space-x-3 px-6 py-5">
            <BarChart />
          </div>
        </div>
      </div> */}
      <div className="py-4">
        <Transactions transactions={thisMonth} />
      </div>
    </Container>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if(!session?.user?.id) return { props: { data: [], user_id: null } }

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
  })

  if(user){
    const plaid = await prisma.plaid.findMany({
      where: { user_id: user.id },
    })

    const thisMonth = await prisma.transactions.findMany({
      where: {
        user_id: user.id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().startOf('month').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const lastMonth = await prisma.transactions.findMany({
      where: {
        user_id: user.id,
        date: {
          lte: DateTime.now().startOf('month').toISO(),
          gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const thisWeek = await prisma.transactions.findMany({
      where: {
        user_id: user.id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().startOf('week').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const lastWeek = await prisma.transactions.findMany({
      where: {
        user_id: user.id,
        date: {
          lte: DateTime.now().startOf('week').toISO(),
          gte: DateTime.now().minus({ week: 1 }).startOf('week').toISO(),
        },
        NOT: {
          primary_category: 'LOAN_PAYMENTS',
        },
      }
    })

    const accounts = await prisma.accounts.findMany({
      where: { user_id: user.id },
    })

    return { props: { thisMonth, lastMonth, thisWeek, lastWeek, accounts, user_id: user.id, plaid } }
  }

  return { props: { thisMonth: [], user_id: user.id } }
}