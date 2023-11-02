import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import Menu from '../components/menu'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSession } from "next-auth/react"
import  { useLocalStorage } from '../utils/useLocalStorage'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError, showIntro }) {
  const { data: session } = useSession()
  const user = session?.user
  const [showConfetti, setConfetti] = useState(false)
  const [show, setShow] = useLocalStorage('show', true)

  useEffect(() => {
    
    // @ts-ignore
    if(user?.login_count <= 1 && show){
      // setEnabled(true)
      if(show) setConfetti(true)
    }
    setShow(false)
    setTimeout(() => {
      showIntro('visionboard')
    }, 1000);
  }, [])

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <div className="visionboard-step">
          <div className="hidden md:block">
            <Editor showError={showError} />
          </div>
        </div>
        <div className="md:hidden text-center">
          <p><strong>For best experience, please use Desktop view</strong></p>
        </div>
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={1000}/>}
      </DashboardLayout>
    </>
  )
}