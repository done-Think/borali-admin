import { useState } from 'react'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { type RemoteData, RD } from '@shared/types'

export function useRemoteData<T>(fetchFn: () => TE.TaskEither<Error, T>) {
  const [state, setState] = useState<RemoteData<Error, T>>(RD.notAsked())

  const execute = async () => {
    setState(RD.loading())
    const result = await fetchFn()()
    pipe(
      result,
      E.match(
        (err) => setState(RD.failure(err)),
        (data) => setState(RD.success(data)),
      ),
    )
  }

  return { state, execute }
}
