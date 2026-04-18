export type RemoteData<E, A> =
  | { readonly _tag: 'NotAsked' }
  | { readonly _tag: 'Loading' }
  | { readonly _tag: 'Failure'; readonly error: E }
  | { readonly _tag: 'Success'; readonly data: A }

export const RD = {
  notAsked: <E, A>(): RemoteData<E, A> => ({ _tag: 'NotAsked' }),
  loading: <E, A>(): RemoteData<E, A> => ({ _tag: 'Loading' }),
  failure: <E, A>(error: E): RemoteData<E, A> => ({ _tag: 'Failure', error }),
  success: <E, A>(data: A): RemoteData<E, A> => ({ _tag: 'Success', data }),

  fold:
    <E, A, R>(
      onNotAsked: () => R,
      onLoading: () => R,
      onFailure: (e: E) => R,
      onSuccess: (a: A) => R,
    ) =>
    (rd: RemoteData<E, A>): R => {
      switch (rd._tag) {
        case 'NotAsked':
          return onNotAsked()
        case 'Loading':
          return onLoading()
        case 'Failure':
          return onFailure(rd.error)
        case 'Success':
          return onSuccess(rd.data)
      }
    },
}
