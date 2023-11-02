import { useState } from 'react'
import Image from 'next/image'
import PlaidLink from '../../components/plaid-link';
import { useSession } from "next-auth/react"
import { ChevronDoubleDownIcon } from '@heroicons/react/20/solid'
import ConfettiExplosion from 'react-confetti-explosion'
import Link from 'next/link'
import LoadingModal from '../../components/modals/loading-modal'

export default function ({ showError }) {
  const [success, showSuccess] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  
  const syncPlaid = async (access_token) => {
    showSuccess(false)
    setRefreshing(true)
    const res = await fetch(`/api/sync_plaid`, {
      body: JSON.stringify({
        user,
        access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error){
      showSuccess(true)
      setRefreshing(false)
    }
  }

  return (
    <div className="bg-white">
      <LoadingModal refreshing={refreshing} text='Updating Your Dashboard...'/>
      <div className="w-full bg-gray-100 h-2.5 mb-4 fixed">
        <div className="bg-pink-600 h-2.5" style={{width: '66%'}}></div>
      </div> 
      <div className="relative isolate pt-14">
        <div className="mx-auto max-w-6xl lg:flex lg:items-center lg:gap-x-10 px-6">
          <div className="mx-auto max-w-7xl lg:mx-0 lg:flex-auto">
            <Image
              src='/trckfi-logo-beta.png'
              alt='Trckfi'
              width={150}
              height={100}
            />
            { success ?
              <div className="text-center">
                <h1 className="mt-20 text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Success!
                </h1>
                <p className="mb-10 text-2xl text-gray-600">
                  soemthing else should go here but not sure yet....
                </p>
                <Link href="/visionboard" className="mt-7 rounded-md bg-pink-600 px-10 py-3 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
                    Go To Visionboard
                </Link>
                <p className="my-4 text-sm text-gray-600">
                  or add more
                </p>
                <PlaidLink user={user} showError={showError} refresh_access_token={null} syncPlaid={syncPlaid}/>
                <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={100}/>
              </div>
              :
              <div className="text-center">
                <h1 className="mt-20 text-3xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Now Let's Add an Account!
                </h1>
                <p className="my-6 pb-2 text-2xl text-gray-600">
                  Trckfi works best when your accounts are connected to be able to best track your finances in one place.
                </p>
                <ChevronDoubleDownIcon className="animate-bounce h-12 w-12 text-pink-600 text-center mx-auto my-5" aria-hidden="true" />
                <PlaidLink user={user} showError={showError} refresh_access_token={null} syncPlaid={syncPlaid}/>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}