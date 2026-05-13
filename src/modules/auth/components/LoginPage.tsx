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
import logo from '@/assets/logo.png'

export function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  function handleEnterAdmin() {
    navigate('/')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: 440,
          borderColor: alpha(theme.palette.secondary.main, 0.18),
          boxShadow: `0 22px 70px ${alpha(theme.palette.common.black, 0.08)}`,
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
                placeholder="admin@borali.com"
                autoComplete="username"
              />
              <TextField
                fullWidth
                size="small"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
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
