import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import logo from '@/assets/logo.png'

export function AuthTransition() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        overflow: 'hidden',
        bgcolor: '#07130f',
        color: '#fff',
        animation: 'boraliAuthFadeIn 260ms ease-out both',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-18%',
          background: `radial-gradient(circle at 50% 42%, ${alpha(
            theme.palette.secondary.main,
            0.2,
          )} 0%, transparent 30%), radial-gradient(circle at 62% 58%, ${alpha('#2dd4a0', 0.16)} 0%, transparent 34%)`,
          filter: 'blur(4px)',
          animation: 'boraliAuthGlow 1400ms ease-in-out infinite alternate',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(45,212,160,0.07) 1px, transparent 1px), linear-gradient(rgba(8,184,232,0.07) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          opacity: 0.28,
        },
        '@keyframes boraliAuthFadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@keyframes boraliAuthGlow': {
          from: { transform: 'scale(0.98)', opacity: 0.75 },
          to: { transform: 'scale(1.04)', opacity: 1 },
        },
        '@keyframes boraliAuthCard': {
          from: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
          to: { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        '@keyframes boraliAuthPulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 0.55 },
          '50%': { transform: 'scale(1.08)', opacity: 0.9 },
        },
        '@keyframes boraliAuthProgress': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(230%)' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          '&::before': { animation: 'none' },
          '& *': { animation: 'none !important' },
        },
      }}
    >
      <Stack
        spacing={2.4}
        alignItems="center"
        textAlign="center"
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 'min(420px, 100%)',
          px: { xs: 2.5, sm: 4 },
          py: { xs: 4, sm: 5 },
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.18)}`,
          bgcolor: alpha('#06100d', 0.62),
          boxShadow: `0 28px 100px ${alpha('#000', 0.36)}`,
          backdropFilter: 'blur(18px)',
          animation: 'boraliAuthCard 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        <Box sx={{ position: 'relative', display: 'grid', placeItems: 'center', width: 154, height: 154 }}>
          <Box
            sx={{
              position: 'absolute',
              inset: 5,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.secondary.main, 0.12),
              boxShadow: `0 0 44px ${alpha(theme.palette.secondary.main, 0.38)}`,
              animation: 'boraliAuthPulse 1300ms ease-in-out infinite',
            }}
          />
          <Box
            component="img"
            src={logo}
            alt="BorAli"
            sx={{ position: 'relative', width: 132, height: 'auto', objectFit: 'contain' }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 10,
              bottom: 14,
              width: 38,
              height: 38,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: alpha('#06100d', 0.94),
              border: `1px solid ${alpha(theme.palette.secondary.light, 0.4)}`,
              color: theme.palette.secondary.light,
              boxShadow: `0 0 22px ${alpha(theme.palette.secondary.main, 0.34)}`,
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 24 }} />
          </Box>
        </Box>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <LockOutlinedIcon sx={{ color: theme.palette.secondary.light, fontSize: 22 }} />
            <Typography component="h1" sx={{ fontSize: { xs: 26, sm: 30 }, lineHeight: 1.1, fontWeight: 950 }}>
              Acesso autorizado
            </Typography>
          </Stack>
          <Typography sx={{ color: alpha('#ffffff', 0.72), fontSize: 15, lineHeight: 1.6 }}>
            Redirecionando para o painel administrativo...
          </Typography>
        </Stack>

        <Box
          aria-hidden="true"
          sx={{
            width: 'min(260px, 76vw)',
            height: 3,
            overflow: 'hidden',
            borderRadius: 999,
            bgcolor: alpha('#ffffff', 0.1),
          }}
        >
          <Box
            sx={{
              width: '45%',
              height: '100%',
              borderRadius: 999,
              background: `linear-gradient(90deg, transparent, ${theme.palette.secondary.light}, ${alpha(
                '#2dd4a0',
                0.95,
              )})`,
              boxShadow: `0 0 16px ${alpha(theme.palette.secondary.main, 0.8)}`,
              animation: 'boraliAuthProgress 1050ms ease-in-out infinite',
            }}
          />
        </Box>
      </Stack>
    </Box>
  )
}
