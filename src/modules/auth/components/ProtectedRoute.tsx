import { useLogto } from '@logto/react'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { useAuthStore } from '@shared/store'
import { api, ApiRequestError } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

const API_RESOURCE = 'https://borali.app/api'

type AdminUser = { id: string; name: string; email: string; role: string }
type AdminLoginResponse = { accessToken: string; refreshToken: string; user: AdminUser }

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, getAccessToken, signOut } = useLogto()
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()
  // Start resolving so we never flash <Navigate> before exchange completes
  const [resolving, setResolving] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  // Prevent re-running exchange on re-mounts caused by redirect loops
  const exchangeAttempted = useRef(false)

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      useAuthStore.getState().clearAuth()
      setResolving(false)
      return
    }

    // Token already in memory — nothing to do
    if (useAuthStore.getState().accessToken) {
      setResolving(false)
      return
    }

    // Guard: only attempt exchange once per mount lifecycle
    if (exchangeAttempted.current) {
      setResolving(false)
      return
    }
    exchangeAttempted.current = true

    // Exchange the Logto session token for a BoraLi admin JWT
    void (async () => {
      try {
        const logtoToken = await getAccessToken(API_RESOURCE)
        if (!logtoToken) {
          // No Logto token — sign out to prevent a redirect loop
          useAuthStore.getState().clearAuth()
          signOut(`${window.location.origin}/login`)
          return
        }

        const loginRes = await api.post<AdminLoginResponse | ApiEnvelope<AdminLoginResponse>>('/auth/admin-login', {
          accessToken: logtoToken,
        })
        const data = unwrap<AdminLoginResponse>(loginRes)

        useAuthStore.getState().setAuth(
          { id: data.user.id, name: data.user.name, email: data.user.email, role: 'admin' },
          data.accessToken,
          data.refreshToken,
        )
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 403) {
          // User is not an admin — show denial screen instead of looping
          setAccessDenied(true)
        } else {
          // Network error, 5xx, etc. — clear local token only; user can retry
          useAuthStore.getState().clearAuth()
        }
      } finally {
        setResolving(false)
      }
    })()
  }, [isAuthenticated, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  if (resolving) return <LinearProgress color="secondary" />

  if (accessDenied) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minHeight: '100vh',
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography variant="h3">Acesso negado</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 400 }}>
          Este painel é exclusivo para administradores. Sua conta não tem permissão de acesso.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => signOut(`${window.location.origin}/login`)}
          sx={{ mt: 1, fontWeight: 900 }}
        >
          Voltar ao login
        </Button>
      </Box>
    )
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
