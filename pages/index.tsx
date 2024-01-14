import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import MainMenu from '../components/menu-main'
import Hero from "../components/homepage/hero"
import NewsletterForm from '../components/newsletter-form'
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
      showBundle()
      if(asPath === "/#get-notified"){
        setOpen(true)
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
      <NewsletterForm />
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Best Personal Finance App - Trckfi: Expense & Investment Tracking",
        description: "Take control of your finances with Trckfi, best app for tracking expenses, managing budgets, and monitoring investments. Simplify your financial management and reach your goals.",
        keywords: "Trckfi, Personal finance app, Personal finance tracker, Personal expense tracker app, Personal finance expense tracker, Personal finance management, Personal finance solutions, Best app to keep track of spending, Best expenses app, Best spending tracker, Best expense tracking app, Best monthly expense tracker app, Best personal expense tracker, Best spending tracker app, Best personal expense tracker app, Best online expense tracker, Best app for keeping track of expenses, Finance tracker online, Finance tracker app, Online personal expense tracker, Online finance tracker, Online expense tracker, Online budget tracker, Money tracking app, Online spending tracker , Cash flow tracker, best way to track cash flow, personal cash flow tracker, Net worth analysis, investment tracking app, best investment tracking app"
      },
    },
  }
}