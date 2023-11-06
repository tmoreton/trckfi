import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export function getPostSlugs() {
  const postsDirectory = join(process.cwd(), `outstatic/content/posts`)
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const postsDirectory = join(process.cwd(), `outstatic/content/posts`)
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs()
  const result = slugs.filter((data) => data !== 'schema.json' && data !== '.DS_Store' )
  const posts = result
    .map((slug) => getPostBySlug(slug, fields))
    .filter((post) => post.status === 'published' )
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.publishedAt > post2.publishedAt ? -1 : 1))
  return posts
}
