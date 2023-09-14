import Container from '../components/container'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Menu from '../components/menu'
import Blog from '../components/blog'

export default function Index({ allPosts, showError }) {
  return (
    <Layout>
      <Menu showError={showError}/>
      <Container>
        {allPosts.length > 0 && <Blog posts={allPosts} />}
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
    'date',
  ])
  return {
    props: { allPosts: allPosts.filter(post => post?.title) },
  }
}
