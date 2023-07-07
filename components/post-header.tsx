import CoverImage from './cover-image'
import PostTitle from './post-title'
import type Author from '../interfaces/author'

type Props = {
  title: string
  coverImage: string
  date: string
  author: Author
}

const PostHeader = ({ title, coverImage, date, author }: Props) => {
  return (
    <>
      <div className="max-w-2xl mx-auto py-12">
        <PostTitle>{title}</PostTitle>
        <CoverImage title={title} src={coverImage} />
      </div>
    </>
  )
}

export default PostHeader
