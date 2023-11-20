import { useState } from 'react'
import PlaidLink from '../../components/plaid-link';
import { useSession } from "next-auth/react"
import { ChevronDoubleDownIcon } from '@heroicons/react/20/solid'
import ConfettiExplosion from 'react-confetti-explosion'
import Link from 'next/link'
import ProgressNav from '../../components/progress-nav'
import AddAccounts from '../../components/add-accounts'

export default function ({ showError }) {
  const [success, showSuccess] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  
  const syncPlaid = async (access_token) => {
    showSuccess(true)
    await fetch(`/api/sync_plaid`, {
      body: JSON.stringify({
        user,
        access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  return (
    <>
      <ProgressNav width={'50%'} />
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            { success ?
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Successfully added!
                </h1>
                <p className="mt-5 mb-10 text-2xl text-gray-600">
                  While your transactions are syncing do you want to add more?
                </p>
                <AddAccounts refresh={() => console.log("refresh")} syncPlaid={syncPlaid}/>
                <p className="pb-10 text-sm text-gray-600">
                  or
                </p>
                <Link href="/intro/question-2" className="mt-7 rounded-3xl bg-pink-600 px-10 py-3 text-xl font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                  Next
                </Link>
                <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>
              </div>
              :
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Now Let's Add an Account!
                </h1>
                <p className="my-6 pb-2 text-base lg:text-2xl text-gray-600">
                  Trckfi works best when your accounts are connected to be able to best track your finances in one place.
                </p>
                <ChevronDoubleDownIcon className="animate-bounce h-12 w-12 text-pink-600 text-center mx-auto my-5" aria-hidden="true" />
                <PlaidLink error_code={null} user={user} showError={showError} refresh_access_token={null} syncPlaid={syncPlaid}/>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}