import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import Menu from '../components/menu'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import { useRouter } from 'next/router'
import Link from 'next/link'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const router = useRouter()
  const [showConfetti, setConfetti] = useState(false)
  const [show, setShow] = useLocalStorage('show', true)
  const [enabled, setEnabled] = useState(false)

  const steps = [
    {
      element: '.my-first-step',
      hideNext: true,
      intro: 
        <div className="text-center">
          <p className="text-pink-600"><b>Welcome to your personal Visionboard</b></p>
          <p className="text-md my-3">Here you can add text, images and goals to align with where you see yourself long term</p>
          <Link href="/dashboard">
            <button className="inline-flex w-full justify-center rounded-md bg-pink-600 px-3 py-2 text-lg font-normal text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">
              Checkout Dashboard
            </button>
          </Link>
        </div>,
      position: 'top',
    },
  ]

  useEffect(() => {
    // @ts-ignore
    if(user?.login_count <= 1 && show){
      // setEnabled(true)
      if(show) setConfetti(true)
    }
    setShow(false)
  }, [])

  const onBeforeChange = nextStepIndex => {
    if (nextStepIndex === 1) {
      router.push({
        pathname: '/dashboard',
      })
    }
  }

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
      <Steps
        enabled={enabled}
        steps={steps}
        initialStep={0}
        onBeforeChange={onBeforeChange}
        onExit={() => console.log('done')}
      />
        <div className="hidden md:block my-first-step">
          <Editor showError={showError} />
        </div>
        <div className="md:hidden text-center">
          <p><strong>For best experience, please use Desktop view</strong></p>
        </div>
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={1000}/>}
      </DashboardLayout>
    </>
  )
}