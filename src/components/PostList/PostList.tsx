import {
  LayoutGrid,
  List,
  Flame,
  Clock,
  MessageCircleQuestion,
  Star,
  Briefcase,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import styles from './PostList.module.css'

export type FeedType = 'top' | 'new' | 'past' | 'ask' | 'show' | 'jobs'
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
  past: Clock,
  ask: MessageCircleQuestion,
  show: Star,
  jobs: Briefcase,
}

const feedLabelMap: Record<FeedType, string> = {
  top: 'Top',
  new: 'New',
  past: 'Past',
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
  const FeedIcon = feedIconMap[feedType]
  const feedLabel = feedLabelMap[feedType]

  return (
    <section className={styles.wrap}>
      <div className={styles.topbar}>
        <div className={styles.picker}>
          <select
            className={styles.select}
            value={feedType}
            onChange={(e) => {
              onChangeFeedType(e.target.value as FeedType)
              e.currentTarget.blur()
            }}
            data-testid="feed-select"
            aria-label="Choose feed"
          >
            <optgroup label="Sort by">
              {Object.entries(feedLabelMap).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </optgroup>
          </select>

          <button type="button" className={styles.pickerBtn} aria-label="Choose feed">
            <span className={styles.pickerIcon}>
              <FeedIcon size={16} aria-hidden="true" />
            </span>
            <span className={styles.pickerText}>{feedLabel}</span>
            <span className={styles.chev} aria-hidden="true">
              <ChevronDown size={16} />
            </span>
          </button>
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

      <div className={styles.posts} data-testid="posts" data-view={viewMode}>
        {/* existing list/grid rendering*/}
      </div>
    </section>
  )
}
