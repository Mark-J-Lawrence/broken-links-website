'use client'

/**
 * YouTubeEmbed — renders a responsive 16:9 YouTube iframe embed.
 * Used in MDX blog posts via the MDX_COMPONENTS map.
 *
 * Usage in MDX:
 *   <YouTubeEmbed id="VIDEO_ID" />
 *   <YouTubeEmbed id="VIDEO_ID" caption="Optional caption" />
 */
export default function YouTubeEmbed({ id, caption }) {
  if (!id) return null

  return (
    <figure className="yt-embed">
      <div className="yt-embed-wrap">
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={caption || `YouTube video ${id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="yt-embed-iframe"
        />
      </div>
      {caption && (
        <figcaption className="yt-embed-caption">{caption}</figcaption>
      )}
    </figure>
  )
}

