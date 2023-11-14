import { useSession } from "next-auth/react"
import { useState } from 'react'
import ProgressNav from '../../components/progress-nav'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import  { useLocalStorage } from '../../utils/useLocalStorage'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: 0,
  image: null,
  user_id: null
}

export default function () {
  const { data: session } = useSession()
  const user = session?.user
  const [goal, setGoal] = useLocalStorage('goal', defaultGoal)
  const [step, setStep] = useLocalStorage('steps', 1)

  const onSubmit = async (e) => {
    e.preventDefault()
    // fetch(`/api/add_feedback`, {
    //   body: JSON.stringify({
    //     question: "How can Trckfi help you along the way?",
    //     answers: feedback,
    //     email: user?.email
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    // })
    // router.push({
    //   pathname: '/intro/setup-account',
    // })
  }

  const onNext = () => {
    let num = step
    num++
    console.log(num)
    setStep(num)
  }

  return (
    <>
      <ProgressNav width={'50%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-900 sm:text-6xl leading-tight">
              Let's add some details now
            </h3>
            <div className="w-1/2 mx-auto py-20">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-6">
                Name your goal
              </h3>
              {/* <p className="mb-6 mt-2 text-md text-gray-600">
                People who personalize their goals are more likely to achieve them.
              </p> */}
              <input 
                type="text" 
                className="text-center block py-2.5 px-0 w-full text-3xl font-bold text-pink-600 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-pink-500 peer" 
                required
                value={goal?.name}
                onChange={e => setGoal({ ...goal, name: e.target.value })}
              />
            </div>

            {
              step > 1 &&
              <div className="w-1/2 mx-auto py-20">
                <h3 className="text-2xl font-semibold text-gray-900 leading-tight mb-6">
                  How much do you want to save?
                </h3>
                {/* <p className="mb-6 mt-2 text-md text-gray-600">
                  You'll be able to change this later if you need to.
                </p> */}
                <div className="flex justify-center items-center border-2 rounded-lg border-pink-600 w-[200px] py-4 mx-auto">
                  <span className="text-3xl font-bold text-pink-600">$</span>
                  <input 
                    type="number" 
                    min={0}
                    name="number" 
                    className="w-[100px] text-left text-3xl font-bold text-pink-600 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                    required
                    value={goal?.amount}
                    onChange={e => setGoal({ ...goal, amount: e.target.value })}
                  />
                </div>
              </div>
            }

            {
              step > 2 &&
              <div className="w-1/2 mx-auto py-20">
                <h3 className="text-2xl font-semibold text-gray-900 leading-tight mb-6">
                  Awesome, when do you need it by?
                </h3>
                {/* <p className="mb-6 mt-2 text-md text-gray-600">
                Pick a target date for this goal.
                </p> */}
                <div className="flex justify-center items-center border-2 rounded-lg border-pink-600 w-[275px] py-4 mx-auto">
                  <input 
                    type="date" 
                    name="date" 
                    className="w-[225px] text-left text-3xl font-bold text-pink-600 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                    required
                    value={goal?.date}
                    onChange={e => setGoal({ ...goal, date: e.target.value })}
                  />
                </div>
              </div>
            }
            <div className="pt-10 pb-20">
              {
                step > 2 ?
                <Link href="/goal">
                  <button className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Next
                  </button>
                </Link>
                :
                <button onClick={onNext} className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Next
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}