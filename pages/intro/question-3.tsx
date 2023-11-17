import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import ProgressNav from '../../components/progress-nav'

const items = [
  { text: '🏡  Buy a Home' },
  { text: '💰  Save for Retirement' },
  { text: '💸  Invest and build wealth' },
  { text: '🙌  Financial Freedom' },
  { text: '👶  Start to save for your kid' },
  { text: '💻  Start a business' },
  { text: '🌎  Travel' },
  { text: 'Other' },
]

export default function () {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const [feedback, addFeedback] = useState([])

  const handleChange = (i) => {
    let new_feedback = feedback
    if(!new_feedback.includes(i.text)){
      new_feedback.push(i.text)
    } else {
      new_feedback = new_feedback.filter(text => text !== i.text)
    }
    addFeedback(new_feedback)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    fetch(`/api/add_feedback`, {
      body: JSON.stringify({
        question: "What financial dream do you want to achieve?",
        answers: feedback,
        email: user?.email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    router.push({
      pathname: '/intro/question-4',
    })
  }
  
  return (
    <>
      <ProgressNav width={'70%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
              Let’s get a better understanding of your financial goals 
            </h1>
            <p className="mt-6 pb-2 text-xl lg:text-3xl text-gray-600">
              What financial dream do you want to achieve?
            </p>
            <form onSubmit={onSubmit}>
              <ul role="list" className="grid grid-cols-1 gap-6 my-4 lg:grid-cols-3">
                {items.map((i, id) => (
                  <li key={id} className="rounded-lg bg-gray-100 ring-1 ring-gray-900/10 flex items-center p-4">
                    <label className="select-none container block relative cursor-pointer text-sm lg:text-xl pl-10">{i.text}
                      <input onClick={() => handleChange(i)} name={JSON.stringify(id)} className="absolute opacity-0 left-0 top-0 cursor-pointer rounded-2xl" type="checkbox" />
                      <span className="h-7 w-7 rounded-2xl checkmark absolute top-0 left-0 bg-gray-400"></span>
                    </label>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="items-center rounded-3xl inline-flex w-full justify-center bg-pink-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-pink-500 sm:w-auto"
                >
                Next
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}