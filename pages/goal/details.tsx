import { useSession } from "next-auth/react"
import { useState, useEffect } from 'react'
import ProgressNav from '../../components/progress-nav'
import  { useLocalStorage } from '../../utils/useLocalStorage'
import CreatableSelect from 'react-select/creatable';
import { commaShort } from '../../lib/lodash'
import { useRouter } from 'next/router'

const defaultGoal = {
  name: null,
  date: null,
  current_amount: null,
  amount: 0,
  image: null,
  user_id: null,
  account_id: null
}

const colourStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
  }),
  option: (baseStyles) => ({
    ...baseStyles,
    fontSize: '50',
  }),
}

export default function () {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const [goal, setGoal] = useLocalStorage('goal', defaultGoal)
  const [step, setStep] = useLocalStorage('steps', 1)
  const [accounts, setAccounts] = useState([])
  const [account, setAccount] = useState({})

  useEffect(() => {
    getAccounts()
  }, [])

  const getAccounts = async () => {
    const res = await fetch(`/api/get_accounts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { data } = await res.json()
    let test = data.filter(i => i.type === 'depository')
    setAccounts(test)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if(step > 4){
      await fetch(`/api/add_goal`, {
        body: JSON.stringify({
          goal,
          user
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      setGoal(defaultGoal)
      setStep(1)
      router.push({
        pathname: '/goals',
      })
    }
  }

  const onNext = () => {
    let num = step
    num++
    setStep(num)
  }

  return (
    <>
      <ProgressNav width={'50%'} />
      <div className="relative isolate">
        <form onSubmit={onSubmit}>
          <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
            <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto text-center">
              <h3 className="text-2xl font-semibold text-gray-900 sm:text-6xl leading-tight">
                Let's add some details now
              </h3>
              <div className="w-1/2 mx-auto py-20">
                <p className="text-2xl font-bold text-gray-900 leading-tight mb-6">
                  Name your goal
                </p>
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
                  <p className="text-2xl font-semibold text-gray-900 leading-tight mb-6">
                    How much do you want to save?
                  </p>
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
                  <p className="text-2xl font-semibold text-gray-900 leading-tight mb-4">
                    Which account will you be saving in?
                  </p>
                  <div className="w-1/2 py-4 mx-auto">
                    <CreatableSelect
                      closeMenuOnSelect={true}
                      onChange={e => {
                        onNext()
                        setAccount(e.account)
                        setGoal({ ...goal, account_id: e.account.account_id, current_amount: Math.trunc(e.account.details?.current) })
                      }}
                      options={accounts.map(a => ({ label: a.name, value: a.account_id, account: a}))}
                      styles={colourStyles}
                    />
                  </div>
                </div>
              }

              {
                step > 3 &&
                <div className="w-1/2 mx-auto py-20">
                  <p className="text-2xl font-semibold text-gray-900 leading-tight mb-6">
                    How much are you starting with?
                  </p>
                  <div className="flex justify-center items-center border-2 rounded-lg border-pink-600 w-[200px] py-4 mx-auto">
                    <span className="text-3xl font-bold text-pink-600">$</span>
                    <input 
                      type="number" 
                      min={0}
                      name="number" 
                      className="w-[100px] text-left text-3xl font-bold text-pink-600 appearance-none focus:outline-none focus:ring-0 focus:border-pink-600 peer" 
                      required
                      value={goal?.current_amount}
                      onChange={e => setGoal({ ...goal, current_amount: e.target.value })}
                    />
                  </div>
                  {
                    // @ts-ignore
                    account?.name &&
                    <p className="mb-6 mt-2 text-xs text-gray-600">
                      {/* @ts-ignore */}
                      {account.name} currently has a balance of {commaShort(account?.details?.current)}
                    </p>
                  }
                </div>
              }

              {
                step > 4 &&
                <div className="w-1/2 mx-auto py-20">
                  <p className="text-2xl font-semibold text-gray-900 leading-tight mb-6">
                    Awesome, when do you need it by?
                  </p>
                  
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
                  step > 4 ?
                  <button type="submit" className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Add Goal
                  </button>
                  :
                  <button onClick={onNext} className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Next
                  </button>
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}