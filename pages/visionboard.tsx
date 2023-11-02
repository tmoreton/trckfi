import { useEffect } from 'react'
import dynamic from 'next/dynamic' 
import DashboardLayout from '../components/dashboard-layout'
import Menu from '../components/menu'
import { useRouter } from 'next/router'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError, showIntro }) {
  const router = useRouter()
  const { intro } = router.query

  useEffect(() => {
    if(intro === 'true'){
      setTimeout(() => {
        showIntro('visionboard')
      }, 1000)
    }
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
      </DashboardLayout>
    </>
  )
}