import { AppProps } from 'next/app'
import '../styles/index.css'
import Header from '../components/header'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}
