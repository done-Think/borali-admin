import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DeveloperModeOutlinedIcon from '@mui/icons-material/DeveloperModeOutlined'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useLogto } from '@logto/react'
import { useAuthStore } from '@shared/store'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { isLocalAdminSession, isLocalAuthEnabled, signInLocalAdmin } from '../utils/localAuth'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

const REGISTER_FLAG = 'borali_admin_register_flow'

type LoginLocationState = {
  from?: { pathname?: string; search?: string; hash?: string }
}

export function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated, isLoading } = useLogto()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const isAuthBusy = isLoading || isSigningIn
  const locationState = location.state as LoginLocationState | null
  const redirectPath = locationState?.from
    ? `${locationState.from.pathname ?? '/admin'}${locationState.from.search ?? ''}${locationState.from.hash ?? ''}`
    : '/admin'

  useEffect(() => {
    if (isLocalAdminSession(accessToken)) {
      navigate(redirectPath, { replace: true })
      return
    }

    if (isLoading) return
    if (isAuthenticated && accessToken) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isLoading, accessToken, navigate, redirectPath])

  function handleSignIn() {
    sessionStorage.removeItem(REGISTER_FLAG)
    setIsSigningIn(true)
    signIn(`${window.location.origin}/callback`)
  }

  function handleRegister() {
    sessionStorage.setItem(REGISTER_FLAG, '1')
    // interactionMode 'signUp' direciona para a tela de cadastro do Logto
    signIn(`${window.location.origin}/callback`, 'signUp' as any)
  }

  function handleLocalAccess() {
    signInLocalAdmin()
    navigate(redirectPath, { replace: true })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.common.black, 0.52)}, ${alpha(
            theme.palette.common.black,
            0.42,
          )}), url(${loginMapBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.72,
        },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          borderColor: alpha(theme.palette.secondary.main, 0.18),
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          boxShadow: `0 22px 70px ${alpha(theme.palette.common.black, 0.24)}`,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack spacing={1.5} alignItems="center">
              <Box
                component="img"
                src={logo}
                alt="BorAlí"
                sx={{ width: 180, height: 'auto', objectFit: 'contain' }}
              />
              <Chip
                icon={<ShieldOutlinedIcon />}
                label="Admin Console"
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.dark',
                  '& .MuiChip-icon': { color: 'secondary.main' },
                }}
              />
            </Stack>

            <Stack spacing={1} alignItems="center" textAlign="center">
              <AdminPanelSettingsIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                Acesso administrativo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Autenticação via Logto — apenas usuários com perfil de admin têm acesso.
              </Typography>
            </Stack>

            <Button
              fullWidth
              size="large"
              variant="contained"
              color="secondary"
              startIcon={isAuthBusy ? <CircularProgress color="inherit" size={18} /> : undefined}
              endIcon={isAuthBusy ? undefined : <ArrowForwardIcon />}
              disabled={isAuthBusy}
              onClick={handleSignIn}
              sx={{ minHeight: 48, fontWeight: 800, boxShadow: 'none' }}
            >
              {isAuthBusy ? 'Entrando com Logto...' : 'Entrar com Logto'}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
                ou
              </Typography>
            </Divider>

            <Button
              fullWidth
              size="large"
              variant="outlined"
              color="secondary"
              endIcon={<PersonAddOutlinedIcon />}
              disabled={isAuthBusy}
              onClick={handleRegister}
              sx={{ minHeight: 48, fontWeight: 700, borderStyle: 'dashed' }}
            >
              Criar conta de administrador
            </Button>

            {isLocalAuthEnabled() ? (
              <Button
                fullWidth
                size="large"
                variant="text"
                color="secondary"
                startIcon={<DeveloperModeOutlinedIcon />}
                disabled={isAuthBusy}
                onClick={handleLocalAccess}
                sx={{ minHeight: 46, fontWeight: 800 }}
              >
                Acesso local de desenvolvimento
              </Button>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
