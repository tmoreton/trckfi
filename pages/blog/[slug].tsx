import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import PostBody from '../../components/post-body'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import markdownToHtml from '../../lib/markdownToHtml'
import Menu from '../../components/menu-main'
import Newsletter from '../../components/newsletter-form'

export default function Post({ post, preview, showError }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Menu showError={showError}/>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.publishedAt}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
      <Newsletter />
    </Layout>
  )
}

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'description',
    'coverImage',
    'keywords',
    'status',
    'publishedAt',
    'seoTitle'
  ])
  const content = await markdownToHtml(post.content)

  return {
    props: {
      post: {
        ...post,
        content,
      },
      meta: {
        title: post.title,
        description: post.description,
        coverImage: post.coverImage,
        slug: post.slug,
        publishedAt: post.publishedAt,
        seoTitle: post.seoTitle,
        keywords: post.keywords
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
