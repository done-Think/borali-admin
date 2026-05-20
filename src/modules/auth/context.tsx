import { useState, type ReactNode } from 'react'
import * as O from 'fp-ts/Option'
import type { User } from './types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<O.Option<User>>(O.none)

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (u) => setUser(O.some(u)),
        logout: () => setUser(O.none),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
