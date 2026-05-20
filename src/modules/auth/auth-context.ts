import { createContext } from 'react'
import * as O from 'fp-ts/Option'
import type { User } from './types'

export interface AuthContextValue {
  user: O.Option<User>
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
