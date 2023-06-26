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

export default function ({ transactions, accounts, user_id, plaid }) {
  const { data: session } = useSession()
  const [t, updateTransactions] = useState(transactions);
  const [a, updateAccounts] = useState(accounts);
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
      {/* <div className="sm:flex-auto py-10">
        <h1 className="text-3xl md:text-5xl text-base font-bold leading-2 text-gray-900 ">Dashboard</h1>
      </div>
       */}
      <div className="py-4">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Accounts</h3>
        <div className="sm:flex sm:items-center justify-items-start">
          <Plaid />
          <Tokens getTransactions={getTransactions} tokens={plaid} removeToken={removeToken} loading={loading}/>
        </div>
      </div>
      <div className="py-4">
        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Cards</h3>
        <div className="sm:flex sm:items-center justify-items-start">
          <Cards accounts={a}/>
        </div>
      </div>
      <Snapshot transactions={t} accounts={accounts} />
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
        <h3 className="text-3xl text-base font-semibold leading-6 text-gray-900 mb-4">Transactions</h3>
        <Transactions transactions={t} />
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

    const transactions = await prisma.transactions.findMany({
      where: { 
        user_id: user.id,
        date: {
          lte: DateTime.now().toISO(),
          gte: DateTime.now().minus({ months: 1 }).toISO(),
        },
      },
    })
    const accounts = await prisma.accounts.findMany({
      where: { user_id: user.id },
    })

    return { props: { transactions, accounts: accounts, user_id: user.id, plaid } }
  }

  return { props: { transactions: [], user_id: user.id } }
}