import Transactions from "../components/transactions"
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import Plaid from "../components/plaid"
import prisma from '../lib/prisma';
import { getSession, useSession } from "next-auth/react"
import Header from '../components/header'
import Cards from '../components/cards'
import Chart from '../components/chart'
import { DateTime } from "luxon";

export default function ({ transactions, accounts, user_id }) {
  const { data: session } = useSession()

  const getTransactions = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/get_transactions`, {
      body: JSON.stringify({
        user_id: user_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
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
      <div className="sm:flex-auto py-10">
        <h1 className="text-3xl md:text-5xl text-base font-bold leading-2 text-gray-900 ">Dashboard</h1>
      </div>
      <div className="sm:flex sm:items-center justify-items-start">
        <Plaid />
        <Cards accounts={accounts} />
      </div>
      <Snapshot />
      <Chart />
      {/* <div className="sm:flex sm:items-center items-center justify-between">
        <div className="sm:flex sm:items-center items-center justify-between">
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Export
            </button>
          </div>
          
        </div>
      </div> */}
      <Transactions transactions={transactions} getTransactions={getTransactions} />
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
    console.log(plaid)
    const transactions = await prisma.transactions.findMany({
      where: { 
        user_id: user.id,
        // date: {
        //   lte: DateTime.now().minus({ months: 1 }).toFormat('yyyy-MM-dd'),
        //   gte: DateTime.now().toFormat('yyyy-MM-dd'),
        // },
      },
    })
    const accounts = await prisma.accounts.findMany({
      where: { user_id: user.id },
    })
    return { props: { transactions, accounts, user_id: user.id } }
  }

  return { props: { transactions: [], user_id: user.id } }
}