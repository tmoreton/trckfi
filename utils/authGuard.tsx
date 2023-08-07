import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import LoadingModal from '../components/modals/loading-modal'
import { DateTime } from "luxon"
const authenticated_routes = ['/dashboard', '/settings', '/rules', '/accounts', '/feedback', '/chat', '/visionboard']

export default function ({ children }) {
  const router = useRouter();
  const { status: sessionStatus, data: session } = useSession();
  const authorized = sessionStatus === 'authenticated';
  const unAuthorized = sessionStatus === 'unauthenticated';
  const loading = sessionStatus === 'loading';

  useEffect(() => {
    if(authenticated_routes.includes(router.pathname)){
      // check if the session is loading or the router is not ready
      if (loading || !router.isReady) return;
      // if the user is not authorized, redirect to the login page
      // with a return url to the current page
      if (unAuthorized) {
        router.push({
          pathname: '/auth/email-signin',
        });
      }
      
      if(session?.user){
        let user = session.user
        // @ts-ignore
        if (DateTime.fromSeconds(Number(user?.trial_end)) > DateTime.now()) {
          // do something here to check stripe status
        }
        // @ts-ignore
        if (!user.subscription_id && !user.linked_user_id || !user.active) {
          router.push({
            pathname: '/pricing',
          });
        }
      }
    }
  }, [loading, unAuthorized, sessionStatus, router]);

  // if the user refreshed the page or somehow navigated to the protected page
  if (loading) {
    return null
    return <LoadingModal refreshing={loading} text='Loading...'/>
  }

  // if the user is authorized, render the page
  // otherwise, render nothing while the router redirects him to the login page
  if(!authenticated_routes.includes(router.pathname)) return <div>{children}</div>
  return authorized && <div>{children}</div>
};