import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useAuthStore } from '@shared/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

export function LandingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      navigate('/admin', { replace: true })
    }
  }, [accessToken, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.common.black, 0.56)}, ${alpha(
            theme.palette.common.black,
            0.4,
          )}), url(${loginMapBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.72,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="BorAlí"
          sx={{ width: { xs: 110, sm: 140 }, height: 'auto', objectFit: 'contain' }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          pt: { xs: 2, sm: 0 },
          pb: { xs: 6, sm: 8 },
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ width: '100%', maxWidth: 560 }}>
          <Box
            component="img"
            src={logo}
            alt="BorAlí"
            sx={{ width: { xs: 220, sm: 280 }, height: 'auto', objectFit: 'contain' }}
          />

          <Typography variant="h2" sx={{ fontSize: { xs: '1.7rem', sm: '2.15rem' }, color: 'common.white' }}>
            Gestão administrativa BorAli
          </Typography>

          <Button
            size="large"
            variant="contained"
            color="secondary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/login')}
            sx={{ minHeight: 48, px: 3, fontWeight: 800, boxShadow: 'none' }}
          >
            Acessar Admin
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          px: 2,
          pb: 3,
          color: 'grey.300',
        }}
      >
        <Typography variant="caption">© BorAli</Typography>
      </Box>
    </Box>
  )
}
