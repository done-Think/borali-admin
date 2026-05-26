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
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: AdminUser, accessToken: string, refreshToken?: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        setAuth: (user, accessToken, refreshToken) =>
          set(
            { user, accessToken, refreshToken: refreshToken ?? null, isAuthenticated: true },
            false,
            'setAuth',
          ),
        clearAuth: () =>
          set(
            { user: null, accessToken: null, refreshToken: null, isAuthenticated: false },
            false,
            'clearAuth',
          ),
      }),
      // Only persist the user profile — tokens live in memory only (XSS safety)
      { name: 'borali-auth', partialize: (state) => ({ user: state.user }) },
    ),
    { name: 'AuthStore' },
  ),
)
