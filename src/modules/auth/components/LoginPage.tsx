import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

const ADMIN_EMAIL = 'admin@borali.app'

export function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleEnterAdmin() {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setLoginError(`E-mail inválido.`)
      return
    }

    navigate('/')
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

            </Stack>

            <Stack
              component="form"
              spacing={2}
              onSubmit={(event) => {
                event.preventDefault()
                handleEnterAdmin()
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Login"
                value={email}
                placeholder={ADMIN_EMAIL}
                autoComplete="username"
                error={Boolean(loginError)}
                helperText={loginError || ' '}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (loginError) setLoginError('')
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sem senha por enquanto"
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                          <IconButton
                            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            edge="end"
                            onClick={() => setShowPassword((current) => !current)}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Typography color="text.secondary" sx={{ fontSize: 13, textAlign: 'center' }}>
                Esqueceu a Senha{' '}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  sx={{ fontWeight: 800, verticalAlign: 'baseline' }}
                >
                  Clique Aqui
                </Link>
              </Typography>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  minHeight: 48,
                  fontWeight: 800,
                  boxShadow: 'none',
                }}
              >
                Entrar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
