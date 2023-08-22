import { useSession } from "next-auth/react"
import { useState } from 'react'
import Container from '../components/container'
import Menu from '../components/landing-page/menu'
import Layout from "../components/layout"
import Meta from '../components/meta'
import Hero from "../components/landing-page/hero"

export default function ({ showError }) {

  return (
    <Layout>
      <Meta
        title="Trckfi"
        description=""
        image=''
        keywords=''
      />
      <Menu showError={showError}/>
      <Hero />
      <Container>

      </Container>
    </Layout>
  )
}