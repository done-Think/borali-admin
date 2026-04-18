import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'super_admin'
}

interface AuthState {
  user: AdminUser | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: AdminUser, accessToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        setAuth: (user, accessToken) =>
          set({ user, accessToken, isAuthenticated: true }, false, 'setAuth'),
        clearAuth: () =>
          set(
            { user: null, accessToken: null, isAuthenticated: false },
            false,
            'clearAuth',
          ),
      }),
      { name: 'borali-auth' },
    ),
    { name: 'AuthStore' },
  ),
)
