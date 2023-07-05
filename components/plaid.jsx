import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useSession } from "next-auth/react"
import { PlusCircleIcon } from '@heroicons/react/20/solid'

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
  const onSuccess = React.useCallback(async (public_token) => {
    const access_token = await getAccessToken({ public_token, user_id: session?.user.id })
    setTimeout(() => {
      getAccounts(access_token)
    }, 2000)
    setTimeout(() => {
      syncTransactions(access_token)
    }, 10000)
  }, [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  })

  return (
    <button
      onClick={() => open()} 
      disabled={!ready}
      type="button"
      className="my-4 flex mx-auto items-center justify-center rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
    >
      <p className="mr-3 ">Add Account</p>
      <PlusCircleIcon className="h-8 w-8 text-white" aria-hidden="true" />
    </button>
  );
}

export default Plaid;