import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'


export function getPostSlugs(folder) {
  const postsDirectory = join(process.cwd(), `outstatic/content/${folder}`)
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = [], folder: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const postsDirectory = join(process.cwd(), `outstatic/content/${folder}`)
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

export function getAllPosts(fields: string[] = [], folder: string) {
  const slugs = getPostSlugs(folder)
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields, folder))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
