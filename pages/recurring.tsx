import { useState, useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/20/solid'
import DashboardLayout from "../components/dashboard-layout"
import DashboardMenu from '../components/menu-dashboard'
import { DateTime, Interval } from "luxon"
import { useSession } from "next-auth/react"
import { commaShort } from '../lib/lodash'
import  { useLocalStorage } from '../utils/useLocalStorage'
import LoadingModal from '../components/modals/loading-modal'
import RecurringModal from '../components/modals/recurring-modal'
import { Emoji } from 'emoji-picker-react';
import { useRouter } from 'next/router'
  
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
  const router = useRouter()
  const user = session?.user
  const [days, setDays] = useLocalStorage('days', [])
	const [loading, setLoading] = useState(false)
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false)
  const today = DateTime.now()
  let startDate = today.startOf('month')
  let endDate = today.endOf('month')
  const [allRecurring, setAllRecurring] = useLocalStorage('all_recurring_payments', null)
  const [selectedDay, setSelected] = useState({ 
    date: today.toFormat('yyyy-LL-dd'),
    isCurrentMonth: true,
    events: []
  })

  useEffect(() => {
    getRecurring()
		if(!days){
			setLoading(true)
		}
  }, [])

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
    const { all } = await res.json()
    setAllRecurring(all)
    setCal()
  }

  const setCal = () => {
    let minus = days_of_week.find(i => i.day === startDate.toFormat('ccc')).start
    let add = days_of_week.find(i => i.day === endDate.toFormat('ccc')).end
    let intervals = Interval.fromDateTimes(startDate.minus({ days: minus }).startOf("day"), endDate.plus({ days: add }).endOf("day")).splitBy({ day: 1 }).map(d => {
      let events = allRecurring?.filter(i => i.upcoming_date === d.start.toFormat('yyyy-LL-dd'))
      if(today.toFormat('LLLL') !== d.start.toFormat('LLLL')){
        const todayItem = { 
          date: d.start.toFormat('yyyy-LL-dd'),
          isCurrentMonth: false,
          events: events || [],
        }
        setSelected(todayItem)
        return todayItem
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

  const removeRecurring = async () => {
    setLoading(true)
    await fetch(`/api/remove_recurring`, {
      body: JSON.stringify({
        user,
        item
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    setTimeout(() => {
      router.reload()
    }, 5000)
  }

  const editItem = (i) => {
		setOpen(true)
    setItem(i)
	}
  
  const renderImg = (e) => {
    if(e?.primary_category === 'LOAN_PAYMENTS'){
      let image_url = `/assets/banks/${e?.account.institution}.png`
      return (
        <>
          <div className="flex items-center">
            <div className="pr-2">
              <img
                src={image_url}
                alt={e?.account.institution}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src="/assets/banks/bank.png";
                }}
                className="h-5 w-5 flex-none rounded-md object-cover"
              />
            </div>
            <p className={classNames(Math.trunc(e.amount) < 0 ? "text-green-600" : "text-red-600", "hidden font-bold text-base flex-none  xl:block")}>
              {commaShort(e.account.amount)} 
            </p>
          </div>
          <p className="flex items-center flex-auto text-xs font-bold truncate text-gray-600 mt-1 mb-4">
            {e?.account?.name}
          </p>
        </>
      )
    }
    return (
      <>
        <div className="flex items-center">
          <div className="pr-2">
            <Emoji unified={e?.unified} size={20} />
          </div>
          <p className={classNames(Math.trunc(e.amount) > 0 ? "text-green-600" : "text-red-600", "hidden font-bold text-base flex-none  xl:block")}>
            {commaShort(e.amount)} 
          </p>
        </div>
        <p className="text-xs font-bold truncate text-gray-600 mt-1 mb-4">
          {e.custom_name || e.merchant_name || e.name}
        </p>
      </>
    )
  }

  return (
    <>
      <DashboardMenu showError={showError} title='Recurring'/>
      <DashboardLayout>
      <LoadingModal refreshing={loading} />
      <RecurringModal open={open} setOpen={setOpen} removeRecurring={removeRecurring}/>
      <header className="flex items-end justify-center pt-10 lg:py-2 lg:flex-none">
        <h1 className="text-3xl font-semibold leading-6 text-pink-600 absolute mb-3">
          {today.toFormat('LLLL yyyy')}
        </h1>
      </header>
      
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
                  className={classNames(day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500', 'relative px-4 py-3')}
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
                          <a onClick={() => editItem(event)} className="cursor-pointer group items-center">
                            {renderImg(event)}
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
                  onClick={() => setSelected(day)}
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
          <div className="py-10 lg:hidden">
            <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
              {selectedDay.events.map((e) => (
                <li key={e.id} className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
                  <div className="flex-auto">
                    <div className="flex items-center pb-3 justify-between">
                      <div className="flex items-center justify-between">
                        <Emoji unified={e?.unified} size={30} />
                        <div className="ml-3">
                          <p className="text-base font-semibold text-gray-900 trunc">{e.custom_name || e.merchant_name || e.name}</p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500 trunc">{e?.account?.name}</p>
                        </div>
                      </div>
                      <p className={classNames(Math.trunc(e.amount) < 0 ? "text-green-600" : "text-red-600", "font-bold text-base")}>
                          {commaShort(e?.amount)} 
                      </p>
                    </div>
                    <time dateTime={e.date} className="mt-2 flex items-center text-gray-700">
                      <ClockIcon className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span>{DateTime.fromISO(e.date).toFormat('MMM dd')}</span>
                    </time>
                  </div>
                  <button
                    onClick={() => editItem(e)}
                    className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
                  >
                    Edit
                  </button>
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
