import * as TE from 'fp-ts/TaskEither'

export const fetchJson = <T>(url: string): TE.TaskEither<Error, T> =>
  TE.tryCatch(
    async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      return res.json() as Promise<T>
    },
    (err) => (err instanceof Error ? err : new Error(String(err))),
  )
