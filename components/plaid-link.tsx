import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { PlusCircleIcon } from '@heroicons/react/20/solid'

export default function ({ accounts, getAccounts, syncTransactions, showError, user }) {
  const [linkToken, setLinkToken] = useState(null)

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
  });
  
  const checkAccounts = async () => {
    let active_accounts = []
    accounts.forEach(a => {
      if (!active_accounts.includes(a.item_id)){
        active_accounts.push(a.item_id)
      }
    })
    if(active_accounts.length < 5){
      open()
    } else {
      showError('Account link limit of 5 reached for this account, please un-link an active connection or upgrade to Pro account')
    }
  }

  if(!linkToken) return null
  return (
    <button onClick={checkAccounts} disabled={!ready} className="p-3">
      <PlusCircleIcon className="h-10 w-10 text-pink-600" aria-hidden="true" />
    </button>
  )
}