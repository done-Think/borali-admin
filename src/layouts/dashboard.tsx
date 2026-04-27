import { Outlet } from 'react-router'
import { DashboardLayout } from '@toolpad/core/DashboardLayout'
import { PageContainer } from '@toolpad/core/PageContainer'
import { LogoutToolbar } from '@shared/ui'

export default function Layout() {
  return (
    <DashboardLayout slots={{ toolbarActions: LogoutToolbar }}>
      <PageContainer breadcrumbs={[]} slotProps={{ header: { title: '' } }} sx={{ margin: 2 }}>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  )
}
