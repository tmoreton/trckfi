import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic' 
import Container from '../components/container'
import DashboardLayout from '../components/dashboard-layout'
import Head from 'next/head'
import DrawingTool from '../components/drawing-tool'
import Board from '../components/board'
const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function ({ showError }) {
  const [updateEmail, setUpdateEmail] = useState('')

  useEffect(() => {
  }, [])

  return (
    <DashboardLayout>
      <Head>
        <title>Trckfi - Vision Board</title>
      </Head>
      <Container>
        <Editor />
      </Container>
    </DashboardLayout>
  )
}