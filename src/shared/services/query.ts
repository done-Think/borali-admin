export const ADMIN_QUERY_STALE_TIME = 60_000
export const ADMIN_LIVE_REFETCH_INTERVAL = 30_000

type MockFallbackOptions<T> = {
  fallback: T
  warning: string
}

export async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  { fallback, warning }: MockFallbackOptions<T>,
) {
  try {
    return await fetcher()
  } catch (error) {
    console.warn(warning, error)
    return fallback
  }
}
