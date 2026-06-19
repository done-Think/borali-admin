import * as React from 'react'
import './theme/theme.css'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LogtoProvider, type LogtoConfig, UserScope, ReservedScope } from '@logto/react'
import { SnackbarProvider } from 'notistack'
import { router } from './routes'
import { ADMIN_QUERY_STALE_TIME } from '@shared/services'

const logtoConfig: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APP_ID,
  scopes: [UserScope.Email, UserScope.Profile, ReservedScope.OfflineAccess],
  resources: ['https://borali.app/api'],
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ADMIN_QUERY_STALE_TIME,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LogtoProvider config={logtoConfig}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </QueryClientProvider>
    </LogtoProvider>
  </React.StrictMode>,
)
