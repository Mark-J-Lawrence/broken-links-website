/**
 * getBlogPosts — reads all MDX files from src/data/blog-posts/
 * and returns sorted post metadata (frontmatter).
 *
 * Used by:
 *   - /news (listing page)
 *   - /news/[slug] (individual post)
 *   - Homepage (latest 3 posts)
 *   - /press (filtered by category)
 *   - /news/tag/[tag] (filtered by tag)
 *
 * NOTE: This is a server-side utility (Node.js fs).
 *       Do NOT import in 'use client' components.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = path.join(process.cwd(), 'src', 'data', 'blog-posts')

/**
 * Returns all post metadata sorted newest-first.
 * Does NOT include the full MDX content (for listing pages).
 */
export function getAllPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))

  const posts = files.map(filename => {
    const slug = filename.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
    const { data } = matter(raw)

    return {
      slug,
      title:    data.title    || slug,
      date:     data.date     ? String(data.date) : '1970-01-01',
      category: data.category || 'Uncategorised',
      author:   data.author   || 'Broken Links',
      image:    data.image    || null,
      excerpt:  data.excerpt  || '',
      tags:     data.tags     || [],
    }
  })

  // Sort newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

/**
 * Returns a single post's frontmatter + raw MDX content string.
 * Used by /news/[slug]/page.js
 */
export function getPostBySlug(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title:    data.title    || slug,
    date:     data.date     ? String(data.date) : '1970-01-01',
    category: data.category || 'Uncategorised',
    author:   data.author   || 'Broken Links',
    image:    data.image    || null,
    excerpt:  data.excerpt  || '',
    tags:     data.tags     || [],
    content,  // raw MDX string — rendered by next-mdx-remote in the page
  }
}

/**
 * Returns all unique tags across all posts.
 */
export function getAllTags() {
  const posts = getAllPosts()
  const tagSet = new Set()
  posts.forEach(p => p.tags.forEach(t => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

/**
 * Returns posts filtered by tag.
 */
export function getPostsByTag(tag) {
  return getAllPosts().filter(p => p.tags.includes(tag))
}

/**
 * Returns posts filtered by category.
 */
export function getPostsByCategory(category) {
  return getAllPosts().filter(p =>
    p.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Returns paginated posts.
 * @param {number} page  — 1-based page number
 * @param {number} perPage — posts per page (default 10)
 */
export function getPaginatedPosts(page = 1, perPage = 10) {
  const all = getAllPosts()
  const total = all.length
  const totalPages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const posts = all.slice(start, start + perPage)

  return { posts, total, totalPages, page, perPage }
}

