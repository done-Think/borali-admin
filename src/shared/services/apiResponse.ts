export type ApiEnvelope<T> = {
  data: T
  timestamp: string
}

export function isApiEnvelope<T>(payload: ApiEnvelope<T> | T): payload is ApiEnvelope<T> {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'data' in payload &&
      'timestamp' in payload &&
      typeof payload.timestamp === 'string',
  )
}

export function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const payload = response.data
  return isApiEnvelope(payload) ? payload.data : payload
}

export async function listAllPages<T extends { total: number }>(
  fetchPage: (page: number, limit: number) => Promise<T>,
  pageSize: number,
): Promise<T[]> {
  const firstPage = await fetchPage(1, pageSize)
  const pageCount = Math.ceil(firstPage.total / pageSize)

  if (pageCount <= 1) return [firstPage]

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) => fetchPage(index + 2, pageSize)),
  )

  return [firstPage, ...remainingPages]
}
