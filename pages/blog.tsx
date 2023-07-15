import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Menu from '../components/menu'
import Blog from '../components/blog'

export default function Index({ allPosts, showError }) {
  console.log(allPosts)
  return (
    <Layout>
      <Head>
        <title>Trckfi - Blog</title>
      </Head>
      <Container>
        <Menu showError={showError}/>
        {allPosts.length > 0 && <Blog posts={allPosts.reverse()} />}
      </Container>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'slug',
    'coverImage',
    'excerpt',
    'category',
    'date'
  ])

  return {
    props: { allPosts },
  }
}
