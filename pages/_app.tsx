import { useState } from 'react'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import ErrorModal from '../components/modals/error-modal'
import AuthGuard from '../utils/authGuard'
import Notification from '../components/notification'

import '../styles/index.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-datepicker/dist/react-datepicker.css'
import Hotjar from '@hotjar/browser'

const siteId = 3619138
const hotjarVersion = 6

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  Hotjar.init(siteId, hotjarVersion);
  return (
    <SessionProvider session={session}>
      <ErrorModal error={error} />
        <AuthGuard>
          {
            process.env['NEXT_PUBLIC_BASE_URL'].includes('demo') &&
            <div className="block gap-x-6 bg-pink-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
              <p className="text-sm leading-6 text-white font-semibold text-center">
                Welcome to the Trckfi Demo! 🎉
              </p>
            </div>
          }
          <Notification showError={showError} />
          <Component {...pageProps} showError={showError} />
        </AuthGuard>
      <Analytics />
    </SessionProvider>
  )
}
