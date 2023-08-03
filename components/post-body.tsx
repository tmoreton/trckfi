import markdownStyles from './markdown-styles.module.css'

const PostBody = ({ content }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

export default PostBody
