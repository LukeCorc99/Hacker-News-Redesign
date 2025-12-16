import { ExternalLink, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import type { HackerNewsStory } from '../../types/story'
import styles from './PostCard.module.css'

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000
  const diffInSeconds = now - timestamp
  
  const minutes = Math.floor(diffInSeconds / 60)
  const hours = Math.floor(diffInSeconds / 3600)
  const days = Math.floor(diffInSeconds / 86400)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

type PostCardProps = {
  story: HackerNewsStory
  viewMode: 'list' | 'grid'
  rank: number
}

export default function PostCard({ story, viewMode, rank }: PostCardProps) {
  const formattedTime = getTimeAgo(story.time)

  const getDomain = (url?: string) => {
    if (!url) return null
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return null
    }
  }

  const domain = getDomain(story.url)
  const storyUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`
  const commentsUrl = `https://news.ycombinator.com/item?id=${story.id}`

  return (
    <article className={`${styles.card} ${styles[viewMode]}`} data-testid="post-card">
      <div className={styles.rank}>{rank}</div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <a 
            href={storyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.title}
          >
            {story.title}
          </a>
          {domain && (
            <span className={styles.domain}>
              <ExternalLink size={12} aria-hidden="true" />
              {domain}
            </span>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <TrendingUp size={14} aria-hidden="true" />
            {story.score} points
          </span>
          
          <span className={styles.metaItem}>
            by {story.by}
          </span>
          
          <span className={styles.metaItem}>
            <Clock size={14} aria-hidden="true" />
            {formattedTime}
          </span>
          
          {story.descendants !== undefined && (
            <a 
              href={commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.comments}
            >
              <MessageSquare size={14} aria-hidden="true" />
              {story.descendants} comments
            </a>
          )}
        </div>
      </div>
    </article>
  )
}