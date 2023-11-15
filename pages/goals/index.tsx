import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from "../../components/dashboard-layout"
import { useSession } from "next-auth/react"
import Menu from '../../components/menu'
import Notification from '../../components/notification'
import { useLocalStorage } from '../../utils/useLocalStorage'
import LoadingModal from '../../components/modals/loading-modal'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PinkBtn } from '../../components/pink-btn'
import { TrashIcon } from '@heroicons/react/20/solid'
import { DateTime } from "luxon"
import { commaShort } from '../../lib/lodash'

const Goals = ({ showError }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [refreshing, setRefreshing] = useState(false)
  const [goal, setGoal] = useState(null)
  const [goals, setGoals] = useLocalStorage('goals', [])
  const router = useRouter()

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
    setRefreshing(false)
  }

  const remove = async (id) => {
    setRefreshing(true)
    await fetch(`/api/remove_goal`, {
      body: JSON.stringify({
        id
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    router.reload()
  }

  const renderImg = (account) => {
    if(account){
      let image_url = `/assets/banks/${account.institution}.png`
      return <img
        src={image_url}
        alt={account.institution}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src="/assets/banks/bank.png";
        }}
        className="h-6 w-6 flex-none rounded-md object-cover"
      />
    }
  }

  return (
    <>
      <Menu showError={showError}/>
      <Notification showError={showError} />
      <DashboardLayout>
        <LoadingModal refreshing={refreshing} text='Refreshing Goals...'/>
        <ul role="list" className="-mt-12 space-y-12 divide-y divide-gray-200 xl:col-span-3 mb-10">
          {goals.map((goal) => {
          let progress = ((Number(goal?.account?.details?.current)-Number(goal?.initial_amount))/(Number(goal?.amount)))*1000
          return(
            <li key={goal.id} className="flex flex-col gap-10 pt-12 sm:flex-row">
              <img className="aspect-[4/3] w-96 flex-none rounded-2xl object-cover" src={goal.image} alt="" />
              <div className="flex-auto">
                <h3 className="text-3xl font-bold leading-8 tracking-tight text-gray-900">{goal.name}</h3>
                <p className="text-lg leading-7 mt-2 text-gray-600">{DateTime.fromISO(goal.date).toLocaleString(DateTime.DATE_FULL)}</p>
                <div className="flex justify-between mt-6">
                  <div className="block">
                    <p className="text-xs">Current Amount:</p>
                    <p className="text-2xl font-bold leading-7 text-green-600 mb-4">{commaShort(goal?.account?.details?.current - Number(goal.initial_amount))}</p>
                  </div>
                  <div className="block">
                    <p className="text-xs">Goal Amount:</p>
                    <p className="text-2xl font-bold leading-7 text-gray-700 mb-4">{commaShort(goal.amount)}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-100 h-5 mb-4 rounded-2xl">
                  <div className="bg-pink-600 h-5 rounded-2xl" style={{ width: progress }}></div>
                </div>
                <div className="grid grid-cols-3 mt-2">
                  <div className="col-span-1 flex items-center">
                    {goal?.account && renderImg(goal?.account)}
                    <div>
                      <p className="ml-4 text-xs font-bold">{goal?.account?.name}</p>
                      <p className="ml-4 text-xs">{goal?.account?.official_name}</p>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <p className="ml-4 text-xs text-gray-500">Last Updated:</p>
                    <p className="ml-4 text-xs text-gray-500">{DateTime.fromISO(goal?.account?.updated_at).toLocaleString(DateTime.DATE_FULL)}</p>
                  </div>
                  <div className="col-span-1 text-right">
                    <button type="button" onClick={() => remove(goal.id)}>
                      <TrashIcon className="h-6 w-6 text-red-400 hover:text-red-300" aria-hidden="true" />
                    </button>
                  </div>
                </div>
               </div>
            </li>
          )})}
        </ul>
        <Link href="/goals/create">
          <PinkBtn type="button" onClick={() => console.log(true)}>
            Add Goal
          </PinkBtn>
        </Link>
      </DashboardLayout>
    </>
  )
}

export default dynamic(() => Promise.resolve(Goals), { ssr: false })