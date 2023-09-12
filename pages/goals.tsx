"use client"
import { useState, useEffect } from 'react'
import { BanknotesIcon } from '@heroicons/react/20/solid'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import { useSession } from "next-auth/react"
import Menu from '../components/menu'
import Notification from '../components/notification'
import GoalCard from '../components/goal-card'
import { useLocalStorage } from '../utils/useLocalStorage'
import { commaShort } from '../lib/lodash'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: null,
  image: null,
  user_id: null
}

const Goals = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [goal, setGoal] = useState(null)
  const [goals, setGoals] = useLocalStorage('goals', [])
  const [suggestion, setSuggestion] = useLocalStorage('suggestion', {
    timeframe: 3,
    expenses: 0,
    income: 0,
    goals: 0,
    recurring: 0
  })

  useEffect(() => {
    getGoals()
    getSuggestions(suggestion.timeframe)
  }, [user])

  const getGoals = async () => {
    setGoal(null)
    const res = await fetch(`/api/get_goals`, {
      body: JSON.stringify({
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    showError(error)
    if(!error) setGoals(data)
  }

  const getSuggestions = async (timeframe) => {
    setSuggestion({ ...suggestion, timeframe})
    const res = await fetch(`/api/get_suggestions`, {
      body: JSON.stringify({
        user,
        timeframe
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
    showError(error)
    if(!error) setSuggestion(data)
  }

  const remove = async (id) => {
    const res = await fetch(`/api/remove_goal`, {
      body: JSON.stringify({
        id,
        user
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) getGoals()
  }

  return (
    <>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <div className="mx-auto pb-10 text-center">
          <div className="rounded-2xl bg-gray-50 p-10">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">
              Based the average of your last
              <select
                name="timeframe"
                value={suggestion.timeframe}
                onChange={e => getSuggestions(e.target.value)}
                className="bg-gray-50 appearance-none focus:outline-none focus:ring-0 text-pink-600 px-2 underline w-fit text-center font-bold"
              >
                <option value="1" label="month" />
                <option value="3" label="3 months" />
                <option value="6" label="6 months" />
                <option value="12" label="year" />
              </select>
              of expenses
              <span className="text-red-600 pl-2 underline font-bold">
                {commaShort(suggestion.expenses)}
                <span className="text-xs mr-2">/m</span>
              </span>
              and income
              <span className="text-green-600 pl-2 underline font-bold">
                {commaShort(suggestion.income)}
                <span className="text-xs mr-2">/m</span>
              </span>
              {
                Math.abs(suggestion.expenses) < suggestion.income ?
                <>
                  you are on pace to hit your goal of 
                  <span className="text-pink-600 pl-2 underline font-bold">
                    {commaShort(suggestion.goals)}
                    <span className="text-xs mr-2">/m</span>
                  </span>
                  towards your goals 🎉
                </>
                :
                <>
                  you would need to reduce your expenses
                  <span className="text-pink-600 pl-2 underline font-bold">
                    {commaShort(Math.abs(suggestion.expenses)-suggestion.income)}
                    <span className="text-xs mr-2">/m</span>
                  </span>
                  to achieve your goals, you got this!
                </>
              }
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 pb-12">
          {goals.map(g => <GoalCard user={user} defaultGoal={g} remove={remove} getGoals={getGoals} showError={showError}/>)}
          { goal && <GoalCard user={user} defaultGoal={goal} remove={() => setGoal(null)} getGoals={getGoals} showError={showError}/>}
          <div className="col-span-1 p-4 shadow-sm sm:p-6 sm:px-8 rounded-md border border-gray-200">
            <button
              type="button"
              onClick={() => setGoal(defaultGoal)}
              className=" h-full relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <BanknotesIcon className="mx-auto h-10 w-10 text-gray-500" aria-hidden="true" />
              <div className="flex justify-center items-center mt-3">
                <span className="block text-2xl font-semibold text-gray-500">Add New Goal</span>
              </div>
            </button>
          </div>
        </div>
        {/* <GoalModal user={user} showError={showError} showGoal={showGoal} setShowGoal={setShowGoal}/>
        <PinkBtn type="button" onClick={() => setShowGoal(true)}>
          Add Goal
        </PinkBtn> */}
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Goals), { ssr: false })