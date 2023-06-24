import Transactions from "../components/transactions"
import Container from "../components/container"
import Preview from "../components/dashboard-preview"
import Snapshot from "../components/snapshot"
import Plaid from "../components/plaid"
import prisma from '../lib/prisma';
import { getSession, useSession } from "next-auth/react"

export default function ({ data, user_id }) {
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

  if (!session) return <Preview />

  return (
    <Container>
      <Snapshot />
      <div className="sm:flex sm:items-center items-center justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-3xl md:text-5xl text-base font-bold leading-2 text-gray-900 ">Transactions</h1>
        </div>
        <div className="sm:flex sm:items-center items-center justify-between">
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Export
            </button>
          </div>
          <form onSubmit={getTransactions}>
            <button className="block mx-4 rounded-md bg-pink-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Update Transactions
            </button>
          </form>
          <Plaid />
        </div>
      </div>
      <Transactions transactions={data} />
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
    const transactions = await prisma.transactions.findMany({
      where: { user_id: user.id },
    })
  
    return { props: { data: transactions, user_id: user.id } }
  }
  return { props: { data: [], user_id: user.id } }
}