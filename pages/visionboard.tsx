import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import Menu from '../components/menu'
import Meta from '../components/meta'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'
import Joyride from 'react-joyride';

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const [showConfetti, setConfetti] = useState(false)
  const [show, setShow] = useLocalStorage('show', true)
  const [steps] = useState([
    {
      target: '.my-first-step',
      title: 'test title',
      content: 'These are our super awesome projects!',
      // placement: 'top',
      styles: {
        options: {
          width: 300,
        },
      },
      floaterProps: {
        disableAnimation: false,
      },
      spotlightPadding: -1,
    },
  ])

  useEffect(() => {
    // @ts-ignore
    if(user?.login_count <= 1 && show){
      if(show) setConfetti(true)
    }
    setShow(false)
  }, [])

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        {/* <Joyride steps={steps} /> */}
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