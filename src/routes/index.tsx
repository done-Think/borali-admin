import { createBrowserRouter } from 'react-router'
import App from '@/App'
import Layout from '@layouts/dashboard'
import { LoginPage, ProtectedRoute } from '@modules/auth'
import DashboardPage from '@modules/dashboard'
import ApprovalsPage from '@modules/approvals'
import DriversPage from '@modules/drivers'
import PassengersPage from '@modules/passengers'
import RidesPage from '@modules/rides'
import SupportPage from '@modules/support'
import SubscriptionsPage from '@modules/subscriptions'
import AnalyticsPage from '@modules/analytics'
import SettingsPage from '@modules/settings'

export const router = createBrowserRouter([
  {
    Component: App,
    children: [
      { path: '/login', Component: LoginPage },
      {
        path: '/',
        Component: ProtectedRoute,
        children: [
          {
            Component: Layout,
            children: [
              { index: true, Component: DashboardPage },
              { path: 'approvals', Component: ApprovalsPage },
              { path: 'drivers', Component: DriversPage },
              { path: 'passengers', Component: PassengersPage },
              { path: 'rides', Component: RidesPage },
              { path: 'support', Component: SupportPage },
              { path: 'subscriptions', Component: SubscriptionsPage },
              { path: 'analytics', Component: AnalyticsPage },
              { path: 'settings', Component: SettingsPage },
            ],
          },
        ],
      },
    ],
  },
])
