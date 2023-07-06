import { AppProps } from 'next/app'
import '../styles/index.css'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
      <Analytics />
    </SessionProvider>
  )
}
