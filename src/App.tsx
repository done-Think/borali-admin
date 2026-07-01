import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import BarChartIcon from '@mui/icons-material/BarChart'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import GroupIcon from '@mui/icons-material/Group'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import RouteIcon from '@mui/icons-material/Route'
import SettingsIcon from '@mui/icons-material/Settings'
import { Badge, CssBaseline, GlobalStyles } from '@mui/material'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import { useLogto } from '@logto/react'
import { useAuthStore } from '@shared/store'
import { registerLoginNavigator } from '@shared/services/api'
import { isLocalAdminSession } from '@modules/auth/utils/localAuth'
import { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import logo from '@/assets/logo.png'
import theme from './theme/themeProvider'

function createNavigation(pendingApprovalsCount: number) {
  return [
    { kind: 'header' as const, title: 'Visão Geral' },
    { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
    { kind: 'header' as const, title: 'Gestão' },
    {
      segment: 'approvals',
      title: 'Aprovações',
      icon: (
        <Badge
          badgeContent={pendingApprovalsCount}
          color="error"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              right: 1,
              top: 4,
              minWidth: 17,
              height: 17,
              fontSize: 10,
              fontWeight: 900,
            },
          }}
        >
          <AssignmentTurnedInIcon />
        </Badge>
      ),
    },
    { segment: 'drivers', title: 'Motoristas', icon: <DirectionsCarIcon /> },
    { segment: 'passengers', title: 'Passageiros', icon: <GroupIcon /> },
    { segment: 'rides', title: 'Corridas', icon: <RouteIcon /> },
    { segment: 'support', title: 'Suporte', icon: <HeadsetMicIcon /> },
    { kind: 'header' as const, title: 'Financeiro' },
    { segment: 'subscriptions', title: 'Planos', icon: <CreditCardIcon /> },
    { kind: 'header' as const, title: 'Dados' },
    { segment: 'analytics', title: 'Dados', icon: <BarChartIcon /> },
    { segment: 'settings', title: 'Ajustes', icon: <SettingsIcon /> },
  ]
}

const branding = {
  title: '',
  logo: (
    <img
      src={logo}
      alt="BorAlí"
      style={{
        width: 168,
        maxHeight: 72,
        objectFit: 'contain',
        display: 'block',
        pointerEvents: 'none',
        transform: 'translateX(-64px)',
      }}
    />
  ),
  homeUrl: '/',
}

export default function App() {
  const navigate = useNavigate()
  const { signOut } = useLogto()
  const user = useAuthStore((state) => state.user)
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0)
  const navigation = useMemo(() => createNavigation(pendingApprovalsCount), [pendingApprovalsCount])

  useEffect(() => {
    registerLoginNavigator(() => navigate('/login', { replace: true }))
  }, [navigate])

  const session = useMemo(
    () =>
      user
        ? {
            user: {
              name: user.name,
              email: user.email,
            },
          }
        : null,
    [user],
  )

  useEffect(() => {
    function handlePendingCount(event: Event) {
      const nextCount = (event as CustomEvent<number>).detail

      if (typeof nextCount === 'number') {
        setPendingApprovalsCount(nextCount)
      }
    }

    window.addEventListener('approvals:pending-count', handlePendingCount)
    return () => window.removeEventListener('approvals:pending-count', handlePendingCount)
  }, [])

  return (
    <ReactRouterAppProvider
      theme={theme}
      navigation={navigation}
      branding={branding}
      session={session}
      authentication={{
        signIn: () => navigate('/login'),
        signOut: () => {
          const accessToken = useAuthStore.getState().accessToken
          useAuthStore.getState().clearAuth()
          if (isLocalAdminSession(accessToken)) {
            navigate('/login', { replace: true })
            return
          }
          signOut(`${window.location.origin}/login`)
        },
      }}
      localeText={{
        accountSignOutLabel: 'Sair',
        accountPreviewTitle: 'Conta',
      }}
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            minHeight: '100vh',
          },
          '#root': {
            minHeight: '100vh',
          },
        }}
      />
      <Outlet />
    </ReactRouterAppProvider>
  )
}
