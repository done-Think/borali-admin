import { createContext, useContext, useState, type ReactNode } from 'react'
import * as O from 'fp-ts/Option'
import type { User } from './types'

interface AuthContextValue {
  user: O.Option<User>
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
