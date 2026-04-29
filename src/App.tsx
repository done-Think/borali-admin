import { CssBaseline, GlobalStyles } from '@mui/material'
import { Outlet } from 'react-router'
import { ReactRouterAppProvider } from '@toolpad/core/react-router'
import theme from './theme/themeProvider'

export default function App() {
  return (
    <ReactRouterAppProvider theme={theme}>
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
