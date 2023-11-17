import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import MainMenu from '../components/menu-main'
import Hero from "../components/homepage/hero"
import AccountNetworth from "../components/homepage/account-networth"
import Visonboard from '../components/homepage/visionboard'
import EarlyAccess from '../components/early_access'
import BundleModal from '../components/modals/bundle-modal'
import  { useLocalStorage } from '../utils/useLocalStorage'
import { useRouter } from 'next/router'

export default function Index({ showError }) {
  const [open, setOpen] = useState(false)
  const [subscribed] = useLocalStorage('subscribed', false)
  const [show, setShow] = useLocalStorage('show_modal', false)
  const router = useRouter()
  const { asPath } = router

  useEffect(() => {
    if(!subscribed && !show){
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
      <MainMenu showError={showError}/>
      <BundleModal open={open} setOpen={setOpen} />
      <Hero />
      <AccountNetworth />
      <Visonboard />
      <EarlyAccess />
    </Layout>
  )
}