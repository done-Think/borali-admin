import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useLogto } from '@logto/react'
import { useAuthStore } from '@shared/store'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

type LoginLocationState = {
  from?: {
    pathname?: string
    search?: string
    hash?: string
  }
}

export function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isAuthenticated, isLoading } = useLogto()
  // Only redirect if BOTH Logto AND the BoraLi token are present — prevents the redirect
  // loop that occurs when clearAuth() clears the Zustand token but Logto stays authenticated
  const accessToken = useAuthStore((state) => state.accessToken)
  const locationState = location.state as LoginLocationState | null
  const redirectPath = locationState?.from
    ? `${locationState.from.pathname ?? '/'}${locationState.from.search ?? ''}${locationState.from.hash ?? ''}`
    : '/'

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated && accessToken) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, isLoading, accessToken, navigate, redirectPath])

  function handleSignIn() {
    signIn(`${window.location.origin}/callback`)
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
                alt="BoraLi"
                sx={{
                  width: 180,
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
              <Chip
                icon={<ShieldOutlinedIcon />}
                label="Admin Console"
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.dark',
                  '& .MuiChip-icon': {
                    color: 'secondary.main',
                  },
                }}
              />
            </Stack>

            <Stack spacing={1} alignItems="center" textAlign="center">
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: 48,
                  color: 'secondary.main',
                }}
              />
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
              endIcon={<ArrowForwardIcon />}
              onClick={handleSignIn}
              sx={{
                minHeight: 48,
                fontWeight: 800,
                boxShadow: 'none',
              }}
            >
              Entrar
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
