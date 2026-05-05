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
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import theme from './theme/themeProvider'
import logo from '@/assets/logo.png'
import { pendingApprovalDrivers } from '@modules/approvals/data/mockApprovals'

function createNavigation(pendingApprovalsCount: number) {
  return [
  { kind: 'header' as const, title: 'Visao Geral' },
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
  { kind: 'header' as const, title: 'Gestao' },
  {
    segment: 'approvals',
    title: 'Aprovações',
    icon: (
      <Badge badgeContent={pendingApprovalsCount} color="error" overlap="circular">
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
  logo: <img src={logo} alt="BoraLi" style={{ width: 184, maxHeight: 88, objectFit: 'contain' }} />,
  homeUrl: '/',
}

const session = {
  user: {
    name: 'Admin',
    email: 'Console',
  },
}

export default function App() {
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(pendingApprovalDrivers.length)
  const navigation = createNavigation(pendingApprovalsCount)

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
        signIn: () => {},
        signOut: () => {
          window.location.assign('/login')
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
