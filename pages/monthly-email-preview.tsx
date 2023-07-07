import prisma from '../lib/prisma';
import { render } from '@react-email/render'
import MonthlySummary from "../emails/monthly_summary"
import { DateTime } from "luxon";
import { useSession } from "next-auth/react"

export default function ({ email, month, thisMonth, categories, thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome, recurring }) {
  const { data: session } = useSession()

  if(session?.user?.email === email){
    if (!month) return <></>
    const emailHtml = render(
      <MonthlySummary 
        month={month} 
        thisMonth={thisMonth} 
        categories={categories} 
        thisMonthTotal={thisMonthTotal} 
        lastMonthTotal={lastMonthTotal} 
        thisMonthIncome={thisMonthIncome} 
        lastMonthIncome={lastMonthIncome} 
        recurring={recurring}
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

  const lastMonthIncome = await prisma.transactions.aggregate({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
      },
      primary_category: 'INCOME'
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
  })

  const thisMonthIncome = await prisma.transactions.aggregate({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
      },
      primary_category: 'INCOME'
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
  })

  const lastMonthTotal = await prisma.transactions.aggregate({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
        { primary_category: 'INCOME' },
      ],
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
  })

  const thisMonthTotal = await prisma.transactions.aggregate({
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
        { primary_category: 'INCOME' },
      ],
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
  })

  const categories = await prisma.transactions.groupBy({
    by: ['detailed_category'],
    where: {
      user_id: user.id,
      date: {
        lte: DateTime.now().startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
        { primary_category: 'INCOME' }
      ],
    },
    _sum: {
      amount: true,
    },
  })

  const thisMonth = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      active: true,
      date: {
        lte: DateTime.now().startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
        { primary_category: 'INCOME' }
      ],
    },
    orderBy: {
      amount: 'desc'
    },
  })

  const lastMonth = await prisma.transactions.findMany({
    where: {
      user_id: user.id,
      active: true,
      date: {
        lte: DateTime.now().minus({ months: 1 }).startOf('month').toISO(),
        gte: DateTime.now().minus({ months: 2 }).startOf('month').toISO(),
      },
      NOT: [
        { primary_category: 'LOAN_PAYMENTS' },
        { primary_category: 'TRANSFER_IN' },
        { primary_category: 'TRANSFER_OUT' },
        { primary_category: 'INCOME' }
      ],
    },
    orderBy: {
      amount: 'desc'
    },
  })

  let recurring = []
  lastMonth.forEach((i) => {
    let obj = thisMonth.find((x) => {
      return Number(i.amount) === Number(x.amount) && i.name === x.name
    })
    if(obj){
      recurring.push(obj)
    }
  })
  
  return { props: { 
    thisMonth: JSON.parse(JSON.stringify(thisMonth.slice(0, 10))), 
    categories: JSON.parse(JSON.stringify(categories)),
    thisMonthTotal: JSON.parse(JSON.stringify(thisMonthTotal)),
    lastMonthTotal: JSON.parse(JSON.stringify(lastMonthTotal)),
    thisMonthIncome: JSON.parse(JSON.stringify(thisMonthIncome)),
    lastMonthIncome: JSON.parse(JSON.stringify(lastMonthIncome)),
    month: DateTime.local().monthLong,
    recurring: JSON.parse(JSON.stringify(recurring)),
    email
  }}
}