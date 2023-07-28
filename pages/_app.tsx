import { useState } from 'react'
import { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import ErrorModal from '../components/modals/error-modal'
import AuthGuard from '../utils/authGuard'
import '../styles/index.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import 'react-datepicker/dist/react-datepicker.css'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  return (
    <SessionProvider session={session}>
      <ErrorModal error={error} />
        <AuthGuard>
          <Component {...pageProps} showError={showError} />
        </AuthGuard>
      <Analytics />
    </SessionProvider>
  )
}
