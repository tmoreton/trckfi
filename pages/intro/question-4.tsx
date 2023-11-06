import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import Image from 'next/image'
import ProgressNav from '../../components/progress-nav'

const items = [
  { text: 'Help me keep track of my progress' },
  { text: 'Remind me to allocate 10 minutes weekly for my financial check-in' },
  { text: 'Give me a community and ways to develop a money mindset' },
  { text: 'Offer short-form courses to understand the basics of personal finances' },
  { text: 'Offer long-form courses to become a pro in personal finances' },
  { text: 'Provide advisor consultations to review my unique financial situation' },
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
        question: "How can I help you stay motivated?",
        answers: feedback,
        email: user?.email
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    router.push({
      pathname: '/visionboard',
    })
  }
  
  return (
    <>
      <ProgressNav width={'90%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
              How can I help you stay motivated?
            </h1>
            <form onSubmit={onSubmit}>
              <div className="flex">
                <div className="flex-3">
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
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <Image
                    src="/assets/got-cheers.gif"
                    alt="Cheers"
                    width={250}
                    height={250}
                    className="block my-5 rounded-2xl aspect-[6/5] w-full max-w-sm object-cover lg:mt-0 mx-auto xl:row-span-2 xl:row-end-2 p-8"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-0 mb-10 lg:mt-7 w-full lg:w-fit rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              >
                Finish
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}