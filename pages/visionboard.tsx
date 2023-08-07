import dynamic from 'next/dynamic' 
import Container from '../components/container'
import DashboardLayout from '../components/dashboard-layout'
import Head from 'next/head'
import Menu from '../components/menu'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
  return (
    <>
      <Menu showError={showError}/>
      <DashboardLayout>
        <Head>
          <title>Trckfi - Vision Board</title>
        </Head>
        <Container>
          <Editor />
        </Container>
      </DashboardLayout>
    </>
  )
}