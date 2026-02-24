import { getAllPosts, getAllTags } from '../../lib/getBlogPosts'
import PageTitle from '../../components/PageTitle'
import TagCloud from '../../components/TagCloud'
import NewsClient from '../../components/NewsClient'

export const metadata = {
  title: 'News',
  description: 'Broken Links news — announcements, reviews, interviews and more.',
}

export default function BlogPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="container">
          <PageTitle
            label="Journal"
            title="News"
            subtitle={`${posts.length} post${posts.length !== 1 ? 's' : ''} — announcements, reviews, interviews and more.`}
          />
        </div>
      </section>

      {/* ── Tag Cloud ─────────────────────────────────────────── */}
      {tags.length > 0 && <TagCloud tags={tags} />}

      {/* ── Posts Grid + Pagination (client-side) ─────────────── */}
      <NewsClient posts={posts} />
    </>
  )
}

