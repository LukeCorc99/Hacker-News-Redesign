import type { HackerNewsStory } from '../types/story'

const BASE_URL = 'https://hacker-news.firebaseio.com/v0'

export const fetchStoryIds = async (
    type: 'top' | 'new' | 'ask' | 'show' | 'job'
): Promise<number[]> => {
    const endpointMap = {
        top: 'topstories',
        new: 'newstories',
        ask: 'askstories',
        show: 'showstories',
        job: 'jobstories',
    }

    const endpoint = endpointMap[type]
    const response = await fetch(`${BASE_URL}/${endpoint}.json`)

    if (!response.ok) {
        throw new Error(`Failed to fetch ${type} stories`)
    }

    return response.json()
}

export const fetchStory = async (id: number): Promise<HackerNewsStory> => {
    const response = await fetch(`${BASE_URL}/item/${id}.json`)

    if (!response.ok) {
        throw new Error(`Failed to fetch story ${id}`)
    }

    return response.json()
}

export const fetchStories = async (ids: number[]): Promise<HackerNewsStory[]> => {
    const results = await Promise.allSettled(ids.map((id) => fetchStory(id)))

    return results
        .filter((r): r is PromiseFulfilledResult<HackerNewsStory> => r.status === 'fulfilled')
        .map((r) => r.value)
}
