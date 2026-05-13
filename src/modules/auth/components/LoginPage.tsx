import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import { Box, Button, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router'
import logo from '@/assets/logo.png'

export function LoginPage() {
  const theme = useTheme()
  const navigate = useNavigate()

  function handleEnterAdmin() {
    navigate('/')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(360px, 0.75fr) minmax(0, 1fr)' },
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 7 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: '100%',
            maxWidth: 430,
            borderColor: alpha(theme.palette.secondary.main, 0.18),
            boxShadow: `0 22px 70px ${alpha(theme.palette.common.black, 0.08)}`,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3}>
              <Stack spacing={1.5}>
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
                    alignSelf: 'flex-start',
                    fontWeight: 800,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: 'secondary.dark',
                    '& .MuiChip-icon': {
                      color: 'secondary.main',
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                  Acesso administrativo
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  Entre no painel para acompanhar a operacao do BoraLi.
                </Typography>
              </Stack>

              <Button
                fullWidth
                size="large"
                variant="contained"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                onClick={handleEnterAdmin}
                sx={{
                  minHeight: 48,
                  fontWeight: 800,
                  boxShadow: 'none',
                }}
              >
                Entrar no Admin
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderLeft: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.secondary.main, 0.08),
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(10,190,233,0.16) 0%, rgba(45,212,160,0.2) 48%, rgba(255,255,255,0.78) 100%)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            width: 'min(520px, 68%)',
            aspectRatio: '1 / 1',
            display: 'grid',
            placeItems: 'center',
            borderRadius: 8,
            border: '1px solid',
            borderColor: alpha(theme.palette.secondary.main, 0.18),
            bgcolor: alpha(theme.palette.background.paper, 0.72),
            boxShadow: `0 28px 90px ${alpha(theme.palette.secondary.main, 0.16)}`,
          }}
        >
          <AdminPanelSettingsIcon
            sx={{
              fontSize: 164,
              color: 'secondary.main',
              filter: `drop-shadow(0 18px 34px ${alpha(theme.palette.secondary.main, 0.28)})`,
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
