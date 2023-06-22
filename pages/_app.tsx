import { AppProps } from 'next/app'
import '../styles/index.css'
import Header from '../components/header'
import { Analytics } from '@vercel/analytics/react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps}/>
      <Analytics />
    </>
  )
}
