import prisma from '../lib/prisma';
import { render } from '@react-email/render'
import WeeklySummary from "../emails/weekly_summary"
import { DateTime } from "luxon";
import { useSession } from "next-auth/react"

export default function ({ email, groupByWeek, categories, transactions }) {
  const { data: session } = useSession()

  if(session?.user?.email === email){
    const emailHtml = render(
      <WeeklySummary 
        groupByWeek={groupByWeek} 
        transactions={transactions} 
        categories={categories} 
      />
    )
    return <div dangerouslySetInnerHTML={{__html: emailHtml}}></div>
  }
  return <></>
}

export async function getServerSideProps({ query }) {
  const email = query.email
  if (!email) return { props: {}}
  
  const user = await prisma.user.findUnique({
    where: { email: email },
  })
  if (!user?.id) return { props: {}}
  const user_id = user.id

  const groupByWeek = await prisma.transactions.groupBy({
    by: ['week_year'],
    where: {
      user_id: user_id,
      active: true,
      authorized_date: {
        lte: DateTime.now().toISO(),
        gte: DateTime.now().minus({ weeks: 2 }).startOf('week').toISO()
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
      ],
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
    orderBy: {
      week_year: 'desc'
    },
  })

  const categories = await prisma.transactions.groupBy({
    by: ['detailed_category'],
    where: {
      user_id: user_id,
      active: true,
      authorized_date: {
        lte: DateTime.now().toISO(),
        gte: DateTime.now().minus({ weeks: 1 }).startOf('week').toISO()
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' }
      ],
    },
    _sum: {
      amount: true,
    }
  })

  const transactions = await prisma.transactions.findMany({
    where: {
      user_id: user_id,
      active: true,
      authorized_date: {
        lte: DateTime.now().toISO(),
        gte: DateTime.now().minus({ weeks: 1 }).startOf('week').toISO()
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
      ],
    },
    orderBy: {
      amount: 'desc'
    }
  })   

  return { props: { 
    groupByWeek: JSON.parse(JSON.stringify(groupByWeek)),
    categories: JSON.parse(JSON.stringify(categories)),
    transactions: JSON.parse(JSON.stringify(transactions)),
    email
  }}
}