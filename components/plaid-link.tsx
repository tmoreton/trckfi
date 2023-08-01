import React, { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/router'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/20/solid'

export default function ({ showError, user, refresh_access_token }) {
  const [linkToken, setLinkToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if(user){
      generateToken()
    }
  }, [user])

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

  const getAccounts = async (access_token) => {
    const res = await fetch(`/api/get_plaid_accounts`, {
      body: JSON.stringify({
        user_id: user.id,
        access_token: access_token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) syncAccounts()
  }

  const syncAccounts = async () => {
    const res = await fetch(`/api/sync_accounts`, {
      body: JSON.stringify({ user }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) router.reload()
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      if(refresh_access_token){
        getAccounts(refresh_access_token)
      } else {
        let token = await getAccessToken({ public_token, user_id: user.id, metadata })
        getAccounts(token)
      }
    },
  })
  
  if(!linkToken) return null
  if(refresh_access_token){
    return (
      <button onClick={() => open()} disabled={!ready} className="flex items-center font-semibold text-red-600 hover:text-red-500">
        <ArrowPathIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        Reconnect
      </button>
    )
  }
  return (
    <button onClick={() => open()} disabled={!ready} className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600 text-lg hover:bg-pink-100">
      <PlusIcon className="h-5 w-5" aria-hidden="true" />
      Add Bank Connection
    </button>
  )
}