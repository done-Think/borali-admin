import { useLogto } from '@logto/react'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import { AuthTransition } from './AuthTransition'
import { useAuthStore } from '@shared/store'
import { api, ApiRequestError } from '@shared/services/api'
import { type ApiEnvelope, unwrap } from '@shared/services/apiResponse'
import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { isLocalAdminSession } from '../utils/localAuth'

const API_RESOURCE = 'https://borali.app/api'
const REGISTER_FLAG = 'borali_admin_register_flow'

type AdminUser = { id: string; name: string; email: string; role: string }
type AdminLoginResponse = { accessToken: string; refreshToken: string; user: AdminUser }

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, getAccessToken, signOut } = useLogto()
  const accessToken = useAuthStore((state) => state.accessToken)
  const location = useLocation()
  const [resolving, setResolving] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const exchangeAttempted = useRef(false)

  useEffect(() => {
    if (isLocalAdminSession(useAuthStore.getState().accessToken)) {
      setResolving(false)
      setShowTransition(true)
      return
    }

    if (isLoading) return

    if (!isAuthenticated) {
      useAuthStore.getState().clearAuth()
      setResolving(false)
      return
    }

    if (useAuthStore.getState().accessToken) {
      setResolving(false)
      setShowTransition(true)
      return
    }

    if (exchangeAttempted.current) {
      setResolving(false)
      return
    }
    exchangeAttempted.current = true

    void (async () => {
      // Lê e limpa o flag de registro antes de qualquer await — evita leituras duplas
      const isRegisterFlow = sessionStorage.getItem(REGISTER_FLAG) === '1'
      sessionStorage.removeItem(REGISTER_FLAG)

      try {
        const logtoToken = await getAccessToken(API_RESOURCE)
        if (!logtoToken) {
          useAuthStore.getState().clearAuth()
          signOut(`${window.location.origin}/login`)
          return
        }

        const endpoint = isRegisterFlow ? '/auth/admin-register' : '/auth/admin-login'
        const loginRes = await api.post<AdminLoginResponse | ApiEnvelope<AdminLoginResponse>>(endpoint, {
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
          setAccessDenied(true)
        } else {
          useAuthStore.getState().clearAuth()
        }
      } finally {
        setResolving(false)
        if (useAuthStore.getState().accessToken) {
          setShowTransition(true)
        }
      }
    })()
  }, [accessToken, isAuthenticated, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showTransition) return

    const timeoutId = window.setTimeout(() => {
      setShowTransition(false)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [showTransition])

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

  if ((!isAuthenticated && !isLocalAdminSession(accessToken)) || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (showTransition) {
    return <AuthTransition />
  }

  return <Outlet />
}
