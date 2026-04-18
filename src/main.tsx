import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { router } from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
