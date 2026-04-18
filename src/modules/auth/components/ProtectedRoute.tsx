import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '@shared/store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
