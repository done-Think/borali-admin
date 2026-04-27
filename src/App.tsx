import BarChartIcon from '@mui/icons-material/BarChart'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import GroupIcon from '@mui/icons-material/Group'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import RouteIcon from '@mui/icons-material/Route'
import SettingsIcon from '@mui/icons-material/Settings'
import { GlobalStyles } from '@mui/material'
import { Outlet } from 'react-router'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import type { Navigation } from '@toolpad/core/AppProvider'
import theme from './theme/themeProvider'
import logo from './assets/logo.png'

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Visão Geral' },
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Gestão' },
  { segment: 'drivers', title: 'Motoristas', icon: <DirectionsCarIcon /> },
  { segment: 'passengers', title: 'Passageiros', icon: <GroupIcon /> },
  { segment: 'rides', title: 'Corridas', icon: <RouteIcon /> },
  { segment: 'support', title: 'Suporte', icon: <HeadsetMicIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Financeiro' },
  { segment: 'subscriptions', title: 'Assinaturas', icon: <CreditCardIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Dados' },
  { segment: 'analytics', title: 'Analytics', icon: <BarChartIcon /> },
  { segment: 'settings', title: 'Configurações', icon: <SettingsIcon /> },
]

const BRANDING = {
  title: '',
  logo: <img src={logo} alt="BoraLí" style={{ maxHeight: '85px' }} />,
}

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} theme={theme}>
      <GlobalStyles
        styles={{
          '[data-toolpad-color-scheme="light"] .MuiListItemButton-root.Mui-selected': {
            backgroundColor: '#0ABEE9 !important',
          },
          '[data-toolpad-color-scheme="light"] .MuiListItemButton-root.Mui-selected:hover': {
            backgroundColor: '#089FC4 !important',
          },
          '[data-toolpad-color-scheme="dark"] .MuiListItemButton-root.Mui-selected': {
            backgroundColor: '#2DD4A0 !important',
          },
          '[data-toolpad-color-scheme="dark"] .MuiListItemButton-root.Mui-selected:hover': {
            backgroundColor: '#1DAF82 !important',
          },
          '.MuiListItemButton-root.Mui-selected .MuiListItemIcon-root, .MuiListItemButton-root.Mui-selected .MuiSvgIcon-root, .MuiListItemButton-root.Mui-selected .MuiTypography-root': {
            color: '#FFFFFF !important',
            fill: '#FFFFFF !important',
          },
        }}
      />
      <Outlet />
    </ReactRouterAppProvider>
  )
}
