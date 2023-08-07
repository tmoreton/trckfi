import Container from '../components/container'
import Layout from '../components/layout'
import { getAllPosts } from '../lib/api'
import Menu from '../components/menu'
import Blog from '../components/blog'
import Meta from '../components/meta'

export default function Index({ allPosts, showError }) {
  return (
    <Layout>
      <Meta
        title="Blog"
        description="Learn about money tips and best practices"
        image=''
        keywords=''
      />
      <Menu showError={showError}/>
      <Container>
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
    'date',
    ''
  ])

  return {
    props: { allPosts },
  }
}
