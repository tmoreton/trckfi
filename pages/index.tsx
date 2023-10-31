import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Menu from '../components/menu'
import Hero from "../components/homepage/hero"
import AccountNetworth from "../components/homepage/account-networth"
import Visonboard from '../components/homepage/visionboard'
import EarlyAccess from '../components/early_access'
import EmailModal from '../components/modals/email-modal'
import BundleModal from '../components/modals/bundle-modal'

import  { useLocalStorage } from '../utils/useLocalStorage'
import { useRouter } from 'next/router'

export default function Index({ showError }) {
  const [open, setOpen] = useState(false)
  const [subscribed] = useLocalStorage('subscribed', false)
  const router = useRouter()
  const { asPath } = router

  useEffect(() => {
    if(!subscribed){
      if(asPath === "/#get-notified"){
        setOpen(true)
      } else {
        showBundle()
      }
    }
  }, [])

  const showBundle = () => {
    setTimeout(() => {
      setOpen(true)
    }, 5000)
  }

  return (
    <Layout>
      <Menu showError={showError}/>
      {/* <EmailModal open={open} setOpen={setOpen} showError={showError}/> */}
      <BundleModal open={open} setOpen={setOpen} />
      <Hero />
      <AccountNetworth />
      <Visonboard />
      <EarlyAccess />
    </Layout>
  )
}