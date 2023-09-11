"use client"
import { useState, useEffect } from 'react'
import { BanknotesIcon } from '@heroicons/react/20/solid'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../components/dashboard-layout"
import { useSession } from "next-auth/react"
import Menu from '../components/menu'
import Meta from '../components/meta'
import Notification from '../components/notification'
import GoalCard from '../components/goal-card'
import { useLocalStorage } from '../utils/useLocalStorage'

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

  useEffect(() => {
    getGoals()
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

  const remove = async () => {

  }

  return (
    <>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <Meta
          title="Goals"
          description=""
          image=''
          keywords=''
        />
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 pb-12">
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