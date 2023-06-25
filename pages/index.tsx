import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Hero from '../components/hero'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../interfaces/post'
import Pricing from '../components/pricing'
import Header from '../components/header'

type Props = {
  allPosts: Post[]
}

export default function Index({ allPosts }: Props) {
  const morePosts = allPosts.slice(0, 2)
  return (
    <>
      <Layout>
        <Head>
          <title>Trckfi</title>
        </Head>
        <Container>
          <Header />
          <Hero />
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
          <Pricing />
        </Container>
      </Layout>
    </>
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
