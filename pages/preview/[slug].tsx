import { getPostBySlug, getAllPosts } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import Newsletter from '../../emails/newsletter'

export default function Preview({ post }) {
  return <Newsletter content={post.content}/>
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
    'publishedAt'
  ],
  'newsletters')
  const content = await markdownToHtml(post.content || '')
  
  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'], 'newsletters')
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
