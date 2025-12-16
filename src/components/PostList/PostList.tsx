import {
  LayoutGrid,
  List,
  Flame,
  Clock,
  MessageCircleQuestion,
  Star,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useHackerNews } from '../../hooks/useHackerNews'
import PostCard from '../PostCard/PostCard'
import styles from './PostList.module.css'

export type FeedType = 'top' | 'new' | 'ask' | 'show' | 'jobs'
export type ViewMode = 'list' | 'grid'

type PostListProps = {
  feedType: FeedType
  onChangeFeedType: (next: FeedType) => void
  viewMode: ViewMode
  onChangeViewMode: (next: ViewMode) => void
}

const feedIconMap: Record<FeedType, LucideIcon> = {
  top: Flame,
  new: Clock,
  ask: MessageCircleQuestion,
  show: Star,
  jobs: Briefcase,
}

const feedLabelMap: Record<FeedType, string> = {
  top: 'Top',
  new: 'New',
  ask: 'Ask HN',
  show: 'Show HN',
  jobs: 'Jobs',
}

export default function PostList({
  feedType,
  onChangeFeedType,
  viewMode,
  onChangeViewMode,
}: PostListProps) {
  const [page, setPage] = useState(1)
  const FeedIcon = feedIconMap[feedType]
  const feedLabel = feedLabelMap[feedType]

  const { stories, isLoading, error, totalPages } = useHackerNews({ feedType, page })

  const handleFeedTypeChange = (newFeedType: FeedType) => {
    setPage(1)
    onChangeFeedType(newFeedType)
  }

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className={styles.wrap}>
      <div className={styles.topbar}>
        <div className={styles.pickerWrapper}>
          <div className={styles.pickerDisplay}>
            <span className={styles.pickerIcon}>
              <FeedIcon size={16} aria-hidden="true" />
            </span>
            <span className={styles.pickerText}>{feedLabel}</span>
            <span className={styles.chev} aria-hidden="true">
              <ChevronDown size={16} />
            </span>
          </div>
          <select
            className={styles.pickerSelect}
            value={feedType}
            onChange={(e) => handleFeedTypeChange(e.target.value as FeedType)}
            data-testid="feed-select"
            aria-label="Choose feed"
          >
            {Object.entries(feedLabelMap).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.viewToggle} role="group" aria-label="View mode">
          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            onClick={() => onChangeViewMode('list')}
            data-testid="view-list"
          >
            <List size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.viewBtn}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            onClick={() => onChangeViewMode('grid')}
            data-testid="view-grid"
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading} data-testid="loading">
          <div className={styles.spinner} aria-label="Loading stories" />
          <p>Loading stories...</p>
        </div>
      )}

      {error && (
        <div className={styles.error} data-testid="error" role="alert">
          <p>Failed to load stories. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryBtn}
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && stories.length > 0 && (
        <>
          <div 
            className={`${styles.posts} ${styles[viewMode]}`}
            data-testid="posts" 
            data-view={viewMode}
          >
            {stories.map((story, index) => (
              <PostCard
                key={story.id}
                story={story}
                viewMode={viewMode}
                rank={(page - 1) * 30 + index + 1}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={styles.paginationBtn}
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <span className={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={page >= totalPages}
                className={styles.paginationBtn}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {!isLoading && !error && stories.length === 0 && (
        <div className={styles.empty} data-testid="empty">
          <p>No stories found</p>
        </div>
      )}
    </section>
  )
}