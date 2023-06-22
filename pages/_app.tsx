import { AppProps } from 'next/app'
import '../styles/index.css'
import Header from '../components/header'
import { Analytics } from '@vercel/analytics/react';
import { SessionProvider } from "next-auth/react"

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps}/>
      <Analytics />
    </SessionProvider>
  )
}
