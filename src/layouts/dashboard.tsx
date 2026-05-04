import BarChartIcon from '@mui/icons-material/BarChart'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import GroupIcon from '@mui/icons-material/Group'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import LogoutIcon from '@mui/icons-material/Logout'
import RouteIcon from '@mui/icons-material/Route'
import SettingsIcon from '@mui/icons-material/Settings'
import { Avatar, Box, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout'
import { NavLink, Outlet, useNavigate } from 'react-router'
import logo from '@/assets/logo.png'

const navigation = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon fontSize="small" />, end: true },
  { to: '/drivers', label: 'Motoristas', icon: <DirectionsCarIcon fontSize="small" /> },
  { to: '/passengers', label: 'Passageiros', icon: <GroupIcon fontSize="small" /> },
  { to: '/rides', label: 'Corridas', icon: <RouteIcon fontSize="small" /> },
  { to: '/support', label: 'Suporte', icon: <HeadsetMicIcon fontSize="small" /> },
  { to: '/subscriptions', label: 'Planos', icon: <CreditCardIcon fontSize="small" /> },
  { to: '/analytics', label: 'Dados', icon: <BarChartIcon fontSize="small" /> },
  { to: '/settings', label: 'Ajustes', icon: <SettingsIcon fontSize="small" /> },
]

export default function Layout() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          inset: '0 auto 0 0',
          zIndex: 20,
          width: 160,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ height: 104, display: 'grid', placeItems: 'center', px: 2 }}>
          <Box component="img" src={logo} alt="BoraLi" sx={{ width: 96, maxHeight: 76, objectFit: 'contain' }} />
        </Box>

        <Stack component="nav" spacing={0.5} sx={{ px: 1, flex: 1 }}>
          {navigation.map((item) => (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={{
                minHeight: 35,
                px: 1.25,
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: '22px 1fr',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 700,
                transition: theme.transitions.create(['background-color', 'color', 'box-shadow'], {
                  duration: theme.transitions.duration.shortest,
                }),
                '& svg': {
                  color: 'inherit',
                },
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover',
                },
                '&.active': {
                  color: 'primary.contrastText',
                  bgcolor: 'secondary.main',
                  boxShadow: `inset 3px 0 0 ${theme.palette.primary.main}`,
                },
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Box>
          ))}
        </Stack>

        <Box sx={{ p: 1.5 }}>
          <Stack
            spacing={1.25}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontWeight: 900, fontSize: 13 }}>
                AD
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>
                  Admin
                </Typography>
                <Typography noWrap sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2 }}>
                  Console
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between">
              <ThemeSwitcher />
              <Tooltip title="Sair">
                <IconButton size="small" aria-label="Sair" onClick={() => navigate('/login')}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box component="main" sx={{ ml: '160px', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  )
}
