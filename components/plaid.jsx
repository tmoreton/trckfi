import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useSession } from "next-auth/react"
import { PlusCircleIcon } from '@heroicons/react/20/solid'

const Plaid = ({ getTransactions }) => {
  const [linkToken, setLinkToken] = useState(null)

  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  }

  useEffect(() => {
    generateToken();
  }, [])

  return linkToken != null ? <Link linkToken={linkToken} getTransactions={getTransactions}/> : <></>
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
  console.log(access_token)
  return access_token
}

const Link = ({ linkToken, getTransactions }) => {
  const { data: session } = useSession()
  const onSuccess = React.useCallback((public_token) => {
    const access_token = getAccessToken({ public_token, user_id: session?.user.id })
    setTimeout(() => {
      getTransactions(access_token)
    }, 5000)
  }, [])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  })

  return (
    <button onClick={() => open()} disabled={!ready} className="p-3">
      <PlusCircleIcon className="h-10 w-10 text-pink-600" aria-hidden="true" />
    </button>
  );
};

export default Plaid;