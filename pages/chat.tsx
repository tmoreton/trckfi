import { useSession } from "next-auth/react"
import Container from '../components/container'
import Head from 'next/head'
import DashboardLayout from "../components/dashboard-layout"
import ChatPrompt from "../components/chat-prompt"
import { Fragment, useState, useEffect } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'

export default function ({ showError }) {
  const { data: session } = useSession()
  const [message, setMessage] = useState('')
  const [initialInput, setPrompt] = useState('')

  useEffect(() => {
    startPrompt()
  }, [])

  const startPrompt = async () => {
    const res = await fetch(`/api/get_ai_prompt`, {
      body: JSON.stringify({
        user: session.user,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error, data } = await res.json()
    console.log(data)
    setPrompt(data)
    showError(error)
  }

  const send = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/open_ai`, {
      body: JSON.stringify({
        user: session.user,
        message
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    setMessage('Successfully sent!')
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Chat</title>
      </Head>
      <Container>
        <div className="isolate bg-white px-6 py-12 lg:px-8">
          {/* <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">AI</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              We are constantly trying to Trckfi so we would love to hear from you!
            </p>
          </div> */}
          <ChatPrompt initialInput={initialInput}/>
        </div>
      </Container>
    </DashboardLayout>
  )
}



// const activity = [
//   { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
//   { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
//   { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
//   {
//     id: 4,
//     type: 'commented',
//     person: {
//       name: 'Chelsea Hagon',
//       imageUrl:
//         'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
//     },
//     comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
//     date: '3d ago',
//     dateTime: '2023-01-23T15:56',
//   },
//   { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
//   { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
// ]
// const moods = [
//   { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
//   { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
//   { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
//   { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
//   { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
//   { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
// ]

// function classNames(...classes) {
//   return classes.filter(Boolean).join(' ')
// }

// export default function () {
//   const [selected, setSelected] = useState(moods[5])

//   return (
//     <DashboardLayout>
//       <Head>
//         <title>Trckfi - Chat</title>
//       </Head>
//       <Container>
//       <ul role="list" className="space-y-6">
//         {activity.map((activityItem, activityItemIdx) => (
//           <li key={activityItem.id} className="relative flex gap-x-4">
//             <div
//               className={classNames(
//                 activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
//                 'absolute left-0 top-0 flex w-6 justify-center'
//               )}
//             >
//               <div className="w-px bg-gray-200" />
//             </div>
//             {activityItem.type === 'commented' ? (
//               <>
//                 <img
//                   src={activityItem.person.imageUrl}
//                   alt=""
//                   className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
//                 />
//                 <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
//                   <div className="flex justify-between gap-x-4">
//                     <div className="py-0.5 text-xs leading-5 text-gray-500">
//                       <span className="font-medium text-gray-900">{activityItem.person.name}</span> commented
//                     </div>
//                     <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
//                       {activityItem.date}
//                     </time>
//                   </div>
//                   <p className="text-sm leading-6 text-gray-500">{activityItem.comment}</p>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
//                   {activityItem.type === 'paid' ? (
//                     <CheckCircleIcon className="h-6 w-6 text-pink-600" aria-hidden="true" />
//                   ) : (
//                     <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
//                   )}
//                 </div>
//                 <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                   <span className="font-medium text-gray-900">{activityItem.person.name}</span> {activityItem.type} the
//                   invoice.
//                 </p>
//                 <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs leading-5 text-gray-500">
//                   {activityItem.date}
//                 </time>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>

//       {/* New comment form */}
//       <div className="mt-6 flex gap-x-3">
//         <form action="#" className="relative flex-auto">
//           <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-0">
//             <label htmlFor="comment" className="sr-only">
//               Add your comment
//             </label>
//             <textarea
//               rows={2}
//               name="comment"
//               id="comment"
//               className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//               placeholder="Add your comment..."
//               defaultValue={''}
//             />
//           </div>

//           <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
//             <button
//               type="submit"
//               className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//             >
//               Comment
//             </button>
//           </div>
//         </form>
//       </div>
//     </Container>
//   </DashboardLayout>
//   )
// }
