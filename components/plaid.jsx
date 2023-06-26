import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useSession } from "next-auth/react"
import { PlusCircleIcon } from '@heroicons/react/20/solid'

const Plaid = () => {
  const [linkToken, setLinkToken] = useState(null);
  const generateToken = async () => {
    const response = await fetch('/api/create_link_token', {
      method: 'POST',
    });
    const data = await response.json();
    setLinkToken(data.link_token);
  };
  useEffect(() => {
    generateToken();
  }, []);
  return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};

const getTransactions = async (user_id) => {
  const res = await fetch(`/api/get_transactions`, {
    body: JSON.stringify({
      user_id: user_id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
}

const Link = (props) => {
  const { data: session } = useSession()
  const onSuccess = React.useCallback((public_token, metadata) => {
    const response = fetch('/api/set_access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token, metadata, user_id: session?.user.id }),
    });
    getTransactions(session?.user.id)
  }, []);

  const config = {
    token: props.linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <>
      <button onClick={() => open()} disabled={!ready} className="rounded-md bg-pink-600 p-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
        <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
};

export default Plaid;