import prisma from '../lib/prisma';
import { render } from '@react-email/render'
import WeeklySummary from "../emails/weekly_summary"
import { DateTime } from "luxon";
import { useSession } from "next-auth/react"

export default function ({ email, groupByWeek, primaryCategories, detailedCategories, transactions, this_week, last_week }) {
  const { data: session } = useSession()

  if(session?.user?.email === email){
    const emailHtml = render(
      <WeeklySummary 
        groupByWeek={groupByWeek} 
        transactions={transactions} 
        primaryCategories={primaryCategories} 
        detailedCategories={detailedCategories}
        this_week={this_week}
        last_week={last_week} 
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

  const date = DateTime.now()
  const this_week = `${date.year}-${date.minus({ days: 3 }).weekNumber}`
  const last_week = `${date.year}-${date.minus({ days: 9 }).weekNumber}`
  const user_query = linked_user_id ? [{ user_id: user_id }, { user_id: linked_user_id }] : [{ user_id: user_id }]

  const groupByWeek = await prisma.transactions.groupBy({
    by: ['week_year'],
    where: {
      AND: [ 
        { OR: user_query }, 
        { OR: [{ week_year: this_week }, { week_year: last_week }] } 
      ],
      active: true,
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
        { primary_category: 'INCOME' },
      ],
      amount: {
        lte: 0,
      },
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

  const primary = await prisma.transactions.groupBy({
    by: ['primary_category', 'week_year'],
    where: {
      AND: [ 
        { OR: user_query }, 
        { OR: [{ week_year: this_week }, { week_year: last_week }] } 
      ],
      active: true,
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
        { primary_category: 'INCOME' },
      ],
      amount: {
        lte: 0,
      },
    },
    _sum: {
      amount: true,
    }
  })
  let primaryCategories = []
  primary.forEach(p => {
    if(p.week_year === this_week){
      let item = primary.filter((i) => i.week_year === last_week && i.primary_category === p.primary_category)[0]
      primaryCategories.push({
        category: p.primary_category.split('_').join(' '),
        this_week_amount: p._sum.amount,
        last_week_amount: item?._sum.amount
      })
    }
  })
  primaryCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

  const detailed = await prisma.transactions.groupBy({
    by: ['detailed_category', 'week_year'],
    where: {
      AND: [ 
        { OR: user_query }, 
        { OR: [{ week_year: this_week }, { week_year: last_week }] } 
      ],
      active: true,
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
        { primary_category: 'INCOME' },
      ],
      amount: {
        lte: 0,
      },
    },
    _sum: {
      amount: true,
    }
  })
  let detailedCategories = []
  detailed.forEach(p => {
    if(p.week_year === this_week){
      let item = detailed.filter((i) => i.week_year === last_week && i.detailed_category === p.detailed_category)[0]
      detailedCategories.push({
        category: p.detailed_category.split('_').join(' '),
        this_week_amount: p._sum.amount,
        last_week_amount: item?._sum.amount
      })
    }
  })
  detailedCategories.sort((a, b) => a.this_week_amount-b.this_week_amount)

  const t = await prisma.transactions.findMany({
    where: {
      OR: user_query,
      active: true,
      week_year: this_week,
      NOT: [
        { detailed_category: 'CREDIT_CARD_PAYMENT' },
        { primary_category: 'INCOME' },
      ],
    },
    orderBy: {
      amount: 'asc'
    }
  })
  const transactions = t.slice(0, 10)

  return { props: { 
    groupByWeek: JSON.parse(JSON.stringify(groupByWeek)),
    primaryCategories: JSON.parse(JSON.stringify(primaryCategories)),
    detailedCategories: JSON.parse(JSON.stringify(detailedCategories)),
    transactions: JSON.parse(JSON.stringify(transactions)),
    email,
    this_week,
    last_week
  }}
}