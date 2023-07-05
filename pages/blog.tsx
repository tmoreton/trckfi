import Container from '../components/container'
import MoreStories from '../components/more-stories'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'
import Post from '../interfaces/post'
import Menu from '../components/menu'

type Props = {
  allPosts: Post[]
}

export default function Index({ allPosts }: Props) {
  const morePosts = allPosts.slice(0, 2)
  return (
    <Layout>
      <Head>
        <title>Trckfi - Blog</title>
      </Head>
      <Container>
        <Menu />
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
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
  ])

  return {
    props: { allPosts },
  }
}
