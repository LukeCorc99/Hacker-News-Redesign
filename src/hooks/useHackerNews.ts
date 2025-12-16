import { useQuery } from '@tanstack/react-query'
import { fetchStoryIds, fetchStories } from '../services/hackerNewsApi'
import type { FeedType } from '../components/PostList'
import type { HackerNewsStory } from '../types/story'

const STORIES_PER_PAGE = 30

type UseHackerNewsOptions = {
    feedType: FeedType
    page: number
}

export function useHackerNews({ feedType, page }: UseHackerNewsOptions) {
    const feedTypeMap: Record<FeedType, 'top' | 'new' | 'ask' | 'show' | 'job'> = {
        top: 'top',
        new: 'new',
        ask: 'ask',
        show: 'show',
        jobs: 'job',
    }
    const apiType = feedTypeMap[feedType]
    
    const {
        data: storyIds = [],
        isLoading: isLoadingIds,
        error: idsError,
    } = useQuery({
        queryKey: ['storyIds', apiType],
        queryFn: () => fetchStoryIds(apiType),
    })

    const startIndex = (page - 1) * STORIES_PER_PAGE
    const endIndex = startIndex + STORIES_PER_PAGE
    const paginatedIds = storyIds.slice(startIndex, endIndex)

    const {
        data: stories = [],
        isLoading: isLoadingStories,
        error: storiesError,
    } = useQuery<HackerNewsStory[]>({
        queryKey: ['stories', apiType, page],
        queryFn: () => fetchStories(paginatedIds),
        enabled: paginatedIds.length > 0,
    })

    return {
        stories,
        isLoading: isLoadingIds || isLoadingStories,
        error: idsError || storiesError,
        totalStories: storyIds.length,
        totalPages: Math.ceil(storyIds.length / STORIES_PER_PAGE),
    }
}