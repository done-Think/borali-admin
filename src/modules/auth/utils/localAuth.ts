import { useAuthStore } from '@shared/store'

export const LOCAL_ADMIN_TOKEN = 'borali-local-admin-token'
export const LOCAL_ADMIN_REFRESH_TOKEN = 'borali-local-admin-refresh-token'

export function isLocalAuthEnabled() {
  return import.meta.env.DEV
}

export function isLocalAdminSession(accessToken?: string | null) {
  return isLocalAuthEnabled() && accessToken === LOCAL_ADMIN_TOKEN
}

export function signInLocalAdmin() {
  if (!isLocalAuthEnabled()) return

  useAuthStore.getState().setAuth(
    {
      id: 'local-admin',
      name: 'Admin Local',
      email: 'admin.local@borali.dev',
      role: 'admin',
    },
    LOCAL_ADMIN_TOKEN,
    LOCAL_ADMIN_REFRESH_TOKEN,
  )
}
