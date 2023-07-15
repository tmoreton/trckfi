import React, { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/router'

export default function ({ showError, user }) {
  const [linkToken, setLinkToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if(user){
      generateToken()
    }
  }, [user])

  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });
    const { link_token, error } = await response.json()
    showError(error)
    setLinkToken(link_token)
  }

  const getAccessToken = async ({ public_token, user_id }) => {
    const res = await fetch(`/api/set_access_token`, {
      body: JSON.stringify({ public_token, user_id }),
      method: 'POST',
    })
    const { access_token, error } = await res.json()
    showError(error)
    return access_token
  }

  const getAccounts = async (access_token) => {
    const res = await fetch(`/api/get_accounts`, {
      body: JSON.stringify({
        user_id: user.id,
        access_token: access_token
      }),
      method: 'POST',
    })
    const { error } = await res.json()
    showError(error)
    if(!error) router.reload()
  }

  const syncTransactions = async (access_token) => {
    const res = await fetch(`/api/sync_transactions`, {
      body: JSON.stringify({
        user_id: user.id,
        access_token: access_token
      }),
      method: 'POST',
    })
    const { error, has_more } = await res.json()
    showError(error)
    if(has_more){
      syncTransactions(access_token)
    }
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      const access_token = await getAccessToken({ public_token, user_id: user.id })
      if(access_token){
        getAccounts(access_token)
        setTimeout(() => {
          syncTransactions(access_token)
        }, 5000)
      } else {
        showError('Couldnt get access token, please try again')
      }
    },
  })

  if(!linkToken) return null
  return (
    <button onClick={() => open()} disabled={!ready} type="button" className="text-sm font-semibold leading-6 text-pink-600 hover:text-pink-500">
      <span aria-hidden="true">+</span> Add another bank
    </button>
  )
}