import React, { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { PlusIcon, ArrowPathIcon, PlusSmallIcon } from '@heroicons/react/20/solid'

export default function ({ showError, user, refresh_access_token, syncPlaid, error_code }) {
  const [linkToken, setLinkToken] = useState(null)

  useEffect(() => {
    generateToken()
  }, [])

  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      body: refresh_access_token && JSON.stringify({ access_token: refresh_access_token }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const { link_token, error } = await response.json()
    showError(error)
    setLinkToken(link_token)
  }

  const getAccessToken = async ({ public_token, user_id, metadata }) => {
    const res = await fetch(`/api/set_access_token`, {
      body: JSON.stringify({ public_token, user_id, metadata }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { access_token, error } = await res.json()
    showError(error)
    return access_token
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      if(refresh_access_token){
        syncPlaid(refresh_access_token)
      } else {
        let token = await getAccessToken({ public_token, user_id: user.id, metadata })
        syncPlaid(token)
      }
    },
  })
  
  if(!linkToken) return null
  if(error_code === 'ITEM_LOGIN_REQUIRED'){
    return (
      <button onClick={() => open()} disabled={!ready} className="flex items-center font-semibold text-red-600 hover:text-red-500">
        <ArrowPathIcon className="h-6 w-6 font-semibold" aria-hidden="true" />
        <span className="ml-2">Reconnect</span>
      </button>
    )
  }
  if(error_code === 'NEW_ACCOUNTS_AVAILABLE'){
    return (
      <button onClick={() => open()} disabled={!ready} className="flex items-center font-semibold text-red-600 hover:text-red-500">
        <PlusSmallIcon className="h-6 w-6 font-semibold" aria-hidden="true" />
        <span className="ml-2">Add New Account</span>
      </button>
    )
  }
  return (
    <button onClick={() => open()} disabled={!ready} className="mb-4 inline-flex items-center rounded-full bg-pink-600 px-2 py-1 text-[15px] font-semibold text-white text-lg hover:bg-pink-500 justify-center w-[100%] lg:w-52">
      <PlusIcon className="h-6 w-6 mr-1 font-semibold" aria-hidden="true" />
      Bank Connection
    </button>
  )
}