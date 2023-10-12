import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Menu from '../components/menu'
import Hero from "../components/homepage/hero"
import AccountNetworth from "../components/homepage/account-networth"
import Visonboard from '../components/homepage/visionboard'
import Newsletter from '../components/newsletter'
import EmailModal from '../components/modals/email-modal'
import { useRouter } from 'next/router'
import  { useLocalStorage } from '../utils/useLocalStorage'

export default function Index({ showError }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [subscribed] = useLocalStorage('subscribed', false)

  useEffect(() => {
    if(!subscribed){
      showPopup()
    }
  }, [])

  const showPopup = () => {
    setTimeout(() => {
      setOpen(true)
    }, 5000)
  }

  return (
    <Layout>
      <Menu showError={showError}/>
      <EmailModal open={open} setOpen={setOpen} showError={showError}/>
      <Hero />
      <AccountNetworth />
      <Visonboard />
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Newsletter showError={showError} />
        </div>
      </div>
    </Layout>
  )
}