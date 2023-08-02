import { remark } from 'remark'
import html from 'remark-html'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html, { sanitize: false }).process(markdown)
  return result.toString()
}
