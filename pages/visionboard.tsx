import dynamic from 'next/dynamic' 
import Container from '../components/container'
import DashboardLayout from '../components/dashboard-layout'
import Head from 'next/head'
import Menu from '../components/menu'
import Meta from '../components/meta'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
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
        <Container>
          <Editor />
        </Container>
      </DashboardLayout>
    </>
  )
}