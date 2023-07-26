import { useState, useEffect } from 'react'
import Container from '../components/container'
import Faq from '../components/faq'
import Hero from '../components/hero'
import Layout from '../components/layout'
import Head from 'next/head'
import Pricing from '../components/pricing'
import Newsletter from '../components/newsletter'
import Feature from '../components/feature'
import Menu from '../components/menu'
import DemoModal from '../components/modals/demo-modal'

export default function Index({ showError, host }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if(host?.includes('demo')){
      setOpen(true)
    }
  }, [host])

  return (
    <Layout>
      <Head>
        <title>Trckfi</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        <DemoModal open={open} setOpen={setOpen} />
        <Hero />
        <Feature />
        {/* <Pricing /> */}
        <Faq />
        <Newsletter showError={showError} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  return {  props: { host: req?.headers?.host } }
}