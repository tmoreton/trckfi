import prisma from '../lib/prisma';
import { render } from '@react-email/render'
import MonthlySummary from "../emails/monthly_summary"
import { DateTime } from "luxon";
import { useSession } from "next-auth/react"

export default function ({ email, groupByMonth, groupByMonthIncome, primaryCategories, detailedCategories, transactions, this_month, last_month, recurring }) {
  const { data: session } = useSession()

  if(session?.user?.email === email){
    const emailHtml = render(
      <MonthlySummary 
        groupByMonth={groupByMonth}
        groupByMonthIncome={groupByMonthIncome}
        transactions={transactions} 
        primaryCategories={primaryCategories} 
        detailedCategories={detailedCategories}
        this_month={this_month}
        last_month={last_month}
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

  const date = DateTime.now()
  const this_month = date.minus({ days: 7 }).toFormat('yyyy-MM')
  const last_month = date.minus({ months: 1, days: 7 }).toFormat('yyyy-MM')

  const linked_user_id = user.linked_user_id
  let linked_user_email;
  if(linked_user_id){
    const res = await prisma.user.findUnique({
      where: { 
        id: linked_user_id,
        active: true
      }
    })
    linked_user_email = res.email
  }
  const user_query = linked_user_id ? [{ user_id: user.id }, { user_id: linked_user_id }] : [{ user_id: user.id }]

  const groupByMonth = await prisma.transactions.groupBy({
    by: ['month_year'],
    where: {
      OR: user_query,
      active: true,
      OR: [
        { month_year: this_month },
        { month_year: last_month },
      ],
      amount: {
        lte: 0,
      },
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
      ],
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
    orderBy: {
      month_year: 'desc'
    },
  })

  const groupByMonthIncome = await prisma.transactions.groupBy({
    by: ['month_year'],
    where: {
      OR: user_query,
      active: true,
      OR: [
        { month_year: this_month },
        { month_year: last_month },
      ],
      amount: {
        gte: 0,
      },
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
      ],
    },
    _sum: {
      amount: true,
    },
    _count: {
      amount: true,
    },
    orderBy: {
      month_year: 'desc'
    },
  })

  const primary = await prisma.transactions.groupBy({
    by: ['primary_category', 'month_year'],
    where: {
      OR: user_query,
      active: true,
      OR: [
        { month_year: this_month },
        { month_year: last_month },
      ],
      amount: {
        lte: 0,
      },
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
      ],
    },
    _sum: {
      amount: true,
    }
  })
  let primaryCategories = []
  primary.forEach(p => {
    if(p.month_year === this_month){
      let item = primary.filter((i) => i.month_year === last_month && i.primary_category === p.primary_category)[0]
      primaryCategories.push({
        category: p.primary_category.split('_').join(' '),
        this_month_amount: p._sum.amount,
        last_month_amount: item?._sum.amount
      })
    }
  })
  primaryCategories.sort((a, b) => a.this_month_amount-b.this_month_amount)
  primaryCategories = primaryCategories.slice(0, 10)

  const detailed = await prisma.transactions.groupBy({
    by: ['detailed_category', 'month_year'],
    where: {
      OR: user_query,
      active: true,
      OR: [
        { month_year: this_month },
        { month_year: last_month },
      ],
      amount: {
        lte: 0,
      },
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
      ],
    },
    _sum: {
      amount: true,
    }
  })
  let detailedCategories = []
  detailed.forEach(p => {
    if(p.month_year === this_month){
      let item = detailed.filter((i) => i.month_year === last_month && i.detailed_category === p.detailed_category)[0]
      detailedCategories.push({
        category: p.detailed_category.split('_').join(' '),
        this_month_amount: p._sum.amount,
        last_month_amount: item?._sum.amount
      })
    }
  })
  detailedCategories.sort((a, b) => a.this_month_amount-b.this_month_amount)
  detailedCategories = detailedCategories.slice(0, 10)

  const t = await prisma.transactions.findMany({
    where: {
      OR: user_query,
      active: true,
      month_year: this_month,
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
      ],
    },
    orderBy: {
      amount: 'asc'
    }
  })
  const transactions = t.slice(0, 10)

  return { props: { 
    groupByMonth: JSON.parse(JSON.stringify(groupByMonth)),
    groupByMonthIncome: JSON.parse(JSON.stringify(groupByMonthIncome)),
    primaryCategories: JSON.parse(JSON.stringify(primaryCategories)),
    detailedCategories: JSON.parse(JSON.stringify(detailedCategories)),
    transactions: JSON.parse(JSON.stringify(transactions)),
    recurring: [],
    email,
    this_month,
    last_month
  }}
}