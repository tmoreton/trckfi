import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Hero from '../components/hero'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Pricing from '../components/pricing'
import Newsletter from '../components/newsletter'
import Feature from '../components/feature'
import Menu from '../components/menu'

export default function Index({ allPosts, showError }) {
  const morePosts = allPosts.slice(0, 2)
  return (
    <Layout>
      <Head>
        <title>Trckfi</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        <Hero />
        <Feature />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        <Pricing />
        {/* <Newsletter /> */}
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
