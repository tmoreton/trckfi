import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useSession } from "next-auth/react"
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'

const Plaid = ({ getAccounts, syncTransactions }) => {
  const [linkToken, setLinkToken] = useState(null)

  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  }

  useEffect(() => {
    generateToken()
  }, [])

  return linkToken != null ? <Link linkToken={linkToken} getAccounts={getAccounts} syncTransactions={syncTransactions}/> : <></>
}

const getAccessToken = async ({ public_token, user_id }) => {
  const res = await fetch(`/api/set_access_token`, {
    body: JSON.stringify({ public_token, user_id }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  const { access_token } = await res.json()
  return access_token
}

const Link = ({ linkToken, getAccounts, syncTransactions }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const onSuccess = async (public_token) => {
    if(session?.user){
      const access_token = await getAccessToken({ public_token, user_id: session?.user.id })
      setTimeout(() => {
        getAccounts(access_token)
      }, 1000)
      setTimeout(() => {
        syncTransactions(access_token)
      }, 10000)
    }
  }

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  })

  const openLink = () => {
    router.replace('/dashboard', undefined, { shallow: true })
    open()
  }

  return (
    <button
      onClick={openLink} 
      disabled={!ready}
      type="button"
    >
      <PlusCircleIcon className="h-10 w-10 text-pink-600" aria-hidden="true" />
    </button>
  );
}

export default Plaid;