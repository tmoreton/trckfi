import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import Menu from '../components/menu'
import Meta from '../components/meta'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSession } from "next-auth/react"
import VisionModal from '../components/modals/vision-modal'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
  const { data: session } = useSession()
  const user = session?.user
  const [showConfetti, setConfetti] = useState(false)
  const [open, openModal] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if(user?.login_count <= 1){
      setConfetti(true)
      openModal(true)
    } 
  }, [])

  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Meta
          title="Visionboard"
          description="Visualize your financial goals for the future"
          image=''
          keywords=''
        />
        <Editor />
        <VisionModal open={open} openModal={openModal} />
        { showConfetti && <ConfettiExplosion force={0.5} duration={3000} particleCount={500} width={3500} zIndex={1000}/>}
      </DashboardLayout>
    </>
  )
}