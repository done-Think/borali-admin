import { useHandleSignInCallback } from '@logto/react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export function CallbackPage() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, error } = useHandleSignInCallback()

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!error) return
    navigate('/login', { replace: true })
  }, [error, navigate])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: '100vh',
      }}
    >
      <CircularProgress color="secondary" />
      <Typography variant="body2" color="text.secondary">
        Autenticando…
      </Typography>
    </Box>
  )
}
