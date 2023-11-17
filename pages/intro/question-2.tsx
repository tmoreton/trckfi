import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import ProgressNav from '../../components/progress-nav'

const items = [
  { text: 'Just getting started, I can use support' },
  { text: 'Got some way to go, but I already have a money routine set up' },
  { text: "I’m mostly on track to save money and invest, but life happened" },
  { text: "I’m making moves - trying to maximize my money" },
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
        question: "Where are you currently in your personal finance journey?",
        answers: feedback,
        email: user?.email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    router.push({
      pathname: '/intro/question-3',
    })
  }
  
  return (
    <>
      <ProgressNav width={'60%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
              Let’s get to know you better{user?.name ? `, ${user?.name.split(' ')[0]}!` : `!`}
            </h1>
            <p className="mt-6 pb-2 text-xl lg:text-3xl text-gray-600">
              Where are you currently in your personal finance journey?
            </p>
            <form onSubmit={onSubmit}>
              <ul role="list" className="my-10 space-y-8 text-xl leading-6 text-gray-600">
                {items.map((i, id) => (
                  <li key={id} className="gap-x-3">
                    <div className="rounded-lg bg-gray-100 ring-1 ring-gray-900/10 flex items-center p-4">
                      <label className="select-none container block relative cursor-pointer text-sm lg:text-xl pl-10">{i.text}
                        <input onClick={() => handleChange(i)} name={JSON.stringify(id)} className="absolute opacity-0 left-0 top-0 cursor-pointer rounded-2xl" type="checkbox" />
                        <span className="h-7 w-7 rounded-2xl checkmark absolute top-0 left-0 bg-gray-400"></span>
                      </label>
                    </div>
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