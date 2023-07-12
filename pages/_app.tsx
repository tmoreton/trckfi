import { useState } from 'react'
import { AppProps } from 'next/app'
import '../styles/index.css'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ErrorModal from '../components/error-modal'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [error, showError] = useState(null)
  return (
    <SessionProvider session={session}>
      <ErrorModal error={error} />
      <Component {...pageProps} showError={showError}/>
      <Analytics />
    </SessionProvider>
  )
}
