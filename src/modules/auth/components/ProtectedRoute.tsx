import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '@shared/store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
