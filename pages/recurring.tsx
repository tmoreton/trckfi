import { useState, useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import DashboardMenu from '../components/menu'
import { DateTime, Interval } from "luxon"
import { useSession } from "next-auth/react"
import { commaShort } from '../lib/lodash'
import  { useLocalStorage } from '../utils/useLocalStorage'
import LoadingModal from '../components/modals/loading-modal'
import RecurringModal from '../components/modals/recurring-modal'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const days_of_week = [
  { day: 'Mon', start: 0, end: 6 },
  { day: 'Tue', start: 1, end: 5 },
  { day: 'Wed', start: 2, end: 4 },
  { day: 'Thu', start: 3, end: 3 },
  { day: 'Fri', start: 4, end: 2 },
  { day: 'Sat', start: 5, end: 1 },
  { day: 'Sun', start: 6, end: 0 }
]

export default function ({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const [days, setDays] = useLocalStorage('days', [])
	const [loading, setLoading] = useState(false)
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false)
  const today = DateTime.now()
  const [totals, setTotals] = useLocalStorage('total_recurring_stats', {
		income: 0,
		expense: 0
	})
  let startDate = today.startOf('month')
  let endDate = today.endOf('month')
  
  const [selectedDay, setSelected] = useState({ 
    date: today.toFormat('yyyy-LL-dd'),
    isCurrentMonth: true,
    events: []
  })

  const getRecurring = async () => {
    const res = await fetch(`/api/get_recurring`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, recurring, inactive, early, stats,  monthly_expense, monthly_income } = await res.json()
    setTotals({
			income: monthly_income._sum.last_amount, 
			expense: monthly_expense._sum.last_amount
		})
    return recurring.concat(early)
  }

  const setCal = async () => {
    const recurring = await getRecurring()
    let minus = days_of_week.find(i => i.day === startDate.toFormat('ccc')).start
    let add = days_of_week.find(i => i.day === endDate.toFormat('ccc')).end
    let intervals = Interval.fromDateTimes(startDate.minus({ days: minus }).startOf("day"), endDate.plus({ days: add }).endOf("day")).splitBy({ day: 1 }).map(d => {
      let events = recurring.filter(i => i.upcoming_date === d.start.toFormat('yyyy-LL-dd'))
      if(today.toFormat('LLLL') !== d.start.toFormat('LLLL')){
        return { 
          date: d.start.toFormat('yyyy-LL-dd'),
          isCurrentMonth: false,
          events: events || [],
        }
      } else {
        return { 
          date: d.start.toFormat('yyyy-LL-dd'),
          isCurrentMonth: true,
          isToday: d.start.toFormat('yyyy-LL-dd') === today.toFormat('yyyy-LL-dd') ? true : false,
          events: events || [],
        }
      }
    })
    setDays(intervals)
    setLoading(false)
  }

	useEffect(() => {
		getRecurring()
    setCal()
		if(!days){
			setLoading(true)
		}
  }, [])

  const updateRecurring = async () => {
    const res = await fetch(`/api/update_recurring`, {
      body: JSON.stringify({
        user,
        item
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setOpen(false)
    setItem({})
    if(!error) getRecurring()
  }

  const removeRecurring = async () => {
    const res = await fetch(`/api/remove_recurring`, {
      body: JSON.stringify({
        user,
        item
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setOpen(false)
    setItem({})
    if(!error) getRecurring()
  }

	const diff = (date) => {
		let today = DateTime.now()
		let upcoming = DateTime.fromISO(date)
		let difference = upcoming.diff(today, ['days']).toObject()
		return Math.round(difference.days)
	}

  const editItem = (i) => {
		setOpen(true)
    setItem(i)
	}
  
  return (
    <>
      <DashboardMenu showError={showError}/>
      <DashboardLayout>
      <LoadingModal refreshing={loading} text='Looking for Recurring Transactions...'/>
      <RecurringModal item={item} setItem={setItem} open={open} setOpen={setOpen} updateRecurring={updateRecurring} removeRecurring={removeRecurring}/>
      <dl className="grid grid-cols-1 gap-1 overflow-hidden text-center sm:grid-cols-1 lg:grid-cols-3 pb-4">
        
        <div className="hidden sm:block">
          <dt className="text-sm font-semibold leading-6 text-gray-600">Recurring Monthly Income<span className="text-xs italic font-normal ml-1">est.</span></dt>
          <dd className="order-first text-4xl font-semibold text-green-600">${Math.round(totals.income)}</dd>
        </div>
        <header className="flex items-end justify-center py-2 lg:flex-none">
          <h1 className="text-2xl font-semibold leading-6 text-pink-600">
            {today.toFormat('LLLL yyyy')}
          </h1>
        </header>
        <div className="hidden sm:block">
          <dt className="text-sm font-semibold leading-6 text-gray-600">Recurring Monthly Expense<span className="text-xs italic font-normal ml-1">est.</span></dt>
          <dd className="order-first text-4xl font-bold text-red-600">${Math.round(Math.abs(totals.expense))}</dd>
        </div>
      </dl>
      <div className="lg:flex lg:h-full lg:flex-col">

        <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
          <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
            <div className="bg-white py-2">
              M<span className="sr-only sm:not-sr-only">on</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">ue</span>
            </div>
            <div className="bg-white py-2">
              W<span className="sr-only sm:not-sr-only">ed</span>
            </div>
            <div className="bg-white py-2">
              T<span className="sr-only sm:not-sr-only">hu</span>
            </div>
            <div className="bg-white py-2">
              F<span className="sr-only sm:not-sr-only">ri</span>
            </div>
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">at</span>
            </div>
            <div className="bg-white py-2">
              S<span className="sr-only sm:not-sr-only">un</span>
            </div>
          </div>
          <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">
              {days.map((day) => (
                <div
                  key={day.date}
                  className={classNames(
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                    'relative px-4 py-3'
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={
                      day.isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-pink-600 font-semibold text-white'
                        : undefined
                    }
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                  {day.events.length > 0 && (
                    <ol className="mt-2">
                      {day.events.map((event) => (
                        <li key={event.id}>
                          <a onClick={() => editItem(event)} className="cursor-pointer group flex items-center">
                            { event.frequency === 'UNKNOWN' ?
                              <p className="flex-auto truncate font-medium text-[10px] text-gray-600 rounded-full my-1 px-2 py-0.5">
                                {event.custom_name || event.merchant_name || event.name}
                              </p>
                              :
                              <p className="flex-auto truncate font-medium text-[10px] text-pink-600 rounded-full bg-pink-50 ring-1 ring-inset ring-pink-600/10 my-1 px-2 py-0.5">
                                {event.custom_name || event.merchant_name || event.name}
                              </p>
                            }
                            {
                              Math.trunc(event.last_amount) > 0 ?
                              <p className="ml-3 hidden font-bold flex-none text-green-500 xl:block">
                                {commaShort(event.last_amount)}
                              </p>
                              :
                              <p className="ml-3 hidden font-bold flex-none text-red-500 xl:block">
                                {commaShort(event.last_amount)}
                              </p>
                            }
                          </a>
                        </li>
                      ))}
                      {/* {day.events.length > 3 && <li className="text-gray-500">+ {day.events.length - 2} more</li>} */}
                    </ol>
                  )}
                </div>
              ))}
            </div>
            <div className="isolate grid w-full grid-cols-7 grid-rows-5 gap-px lg:hidden">
              {days.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    day.isSelected && 'text-white',
                    !day.isSelected && day.isToday && 'text-pink-600',
                    !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                    !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500',
                    'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10'
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      day.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full',
                      day.isSelected && day.isToday && 'bg-pink-600',
                      day.isSelected && !day.isToday && 'bg-gray-900',
                      'ml-auto'
                    )}
                  >
                    {day.date.split('-').pop().replace(/^0/, '')}
                  </time>
                  <span className="sr-only">{day.events.length} events</span>
                  {day.events.length > 0 && (
                    <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                      {day.events.map((event) => (
                        <span key={event.id} className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400" />
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {selectedDay?.events.length > 0 && (
          <div className="px-4 py-10 sm:px-6 lg:hidden">
            <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
              {selectedDay.events.map((event) => (
                <li key={event.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                  <div className="flex-auto">
                    <p className="font-semibold text-gray-900">{event.name}</p>
                    <time dateTime={event.datetime} className="mt-2 flex items-center text-gray-700">
                      <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      {event.time}
                    </time>
                  </div>
                  <a
                    href={event.href}
                    className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
                  >
                    Edit<span className="sr-only">, {event.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </DashboardLayout>
  </>
  )
}