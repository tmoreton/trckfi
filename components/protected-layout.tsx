import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import LoadingModal from './modals/loading-modal'

export default function ({ children }) {
  const router = useRouter();
  const { status: sessionStatus, data: session } = useSession();
  const authorized = sessionStatus === 'authenticated';
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  useEffect(() => {
    // check if the session is loading or the router is not ready
    if (loading || !router.isReady) return;
    // if the user is not authorized, redirect to the login page
    // with a return url to the current page
    if (unAuthorized) {
      router.push({
        pathname: '/auth/email-signin',
      });
    }

    let user = session.user
    if (!user.subscription_id && !user.linked_user_id || !user.active) {
      router.push({
        pathname: '/pricing',
      });
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return null
    return <LoadingModal refreshing={loading} text='Loading...'/>
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  return authorized && <div>{children}</div>
};