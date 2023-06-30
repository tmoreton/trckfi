import prisma from '../lib/prisma';
import { render } from '@react-email/render'
import MonthlySummary from "../emails/monthly_summary"
import { DateTime } from "luxon";

export default function ({ month, thisMonth, categories, thisMonthTotal, lastMonthTotal, thisMonthIncome, lastMonthIncome }) {
  const emailHtml = render(<MonthlySummary month={month} thisMonth={thisMonth} categories={categories} thisMonthTotal={thisMonthTotal} lastMonthTotal={lastMonthTotal} thisMonthIncome={thisMonthIncome} lastMonthIncome={lastMonthIncome} />)
  return <div dangerouslySetInnerHTML={{__html: emailHtml}}></div>
}
 
export async function getServerSideProps(context) {
  const email = 'tmoreton89@gmail.com'

  const user = await prisma.user.findUnique({
    where: { email: email },
  })

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
    by: ['primary_category'],
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
    take: 5,
  })

  return { props: { 
    thisMonth: JSON.parse(JSON.stringify(thisMonth)), 
    categories: JSON.parse(JSON.stringify(categories)),
    thisMonthTotal: JSON.parse(JSON.stringify(thisMonthTotal)),
    lastMonthTotal: JSON.parse(JSON.stringify(lastMonthTotal)),
    thisMonthIncome: JSON.parse(JSON.stringify(thisMonthIncome)),
    lastMonthIncome: JSON.parse(JSON.stringify(lastMonthIncome)),
    month: DateTime.local().monthLong
  } }
}