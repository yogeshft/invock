import { useEffect } from 'react'
import { Box, CircularProgress, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from './app/hooks.js'
import { AuthView } from './components/AuthView.jsx'
import { DashboardView } from './components/DashboardView.jsx'
import { fetchCurrentUser } from './features/auth/authSlice.js'
import { theme } from './theme.js'

function App() {
  const dispatch = useAppDispatch()
  const { initialized, token, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !initialized) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, initialized, token])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-shell">
        <Box className="background-orb orb-a" />
        <Box className="background-orb orb-b" />
        <Box className="background-grid" />

        {token && !initialized ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}
          >
            <CircularProgress color="primary" size={52} />
            <Typography variant="h6">Restoring your workspace...</Typography>
          </Stack>
        ) : user ? (
          <DashboardView />
        ) : (
          <AuthView />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
