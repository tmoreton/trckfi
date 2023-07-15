import { useState, useEffect } from 'react'
import Container from '../components/container'
import Faq from '../components/faq'
import Hero from '../components/hero'
import HeroNew from '../components/hero-new'

import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Pricing from '../components/pricing'
import Newsletter from '../components/newsletter'
import Feature from '../components/feature'
import Menu from '../components/menu'
import DemoModal from '../components/demo-modal'

export default function Index({ allPosts, showError, host }) {
  const [open, setOpen] = useState(false)
  const morePosts = allPosts.slice(0, 2)

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
        <HeroNew />
        <Feature />
        {/* {morePosts.length > 0 && <MoreStories posts={morePosts} />} */}
        <Pricing />
        <Faq />
        <Newsletter showError={showError} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])
  const { req } = context
  return {  props: { allPosts, host: req?.headers?.host } }
}