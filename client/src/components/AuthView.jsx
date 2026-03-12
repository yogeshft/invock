import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { clearAuthError, login, signup } from '../features/auth/authSlice.js'

export function AuthView() {
  const dispatch = useAppDispatch()
  const { error, status } = useAppSelector((state) => state.auth)
  const [mode, setMode] = useState('login')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch, mode])

  const isSubmitting = status === 'loading'

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (mode === 'login') {
      dispatch(
        login({
          email: formValues.email,
          password: formValues.password,
        }),
      )
      return
    }

    dispatch(signup(formValues))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 4, lg: 6 },
        py: { xs: 3, md: 5 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' },
          gap: 3,
          alignItems: 'stretch',
          minHeight: { lg: 'calc(100vh - 64px)' },
        }}
      >
       

        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h4">Access your inventory workspace</Typography>
              <Typography color="text.secondary">
                Use the same panel for account creation and login.
              </Typography>
            </Stack>

            <Tabs
              value={mode}
              onChange={(_event, value) => setMode(value)}
              variant="fullWidth"
              sx={{
                p: 0.5,
                borderRadius: 999,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              }}
            >
              <Tab label="Login" value="login" />
              <Tab label="Signup" value="signup" />
            </Tabs>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                {mode === 'signup' ? (
                  <TextField
                    label="Full name"
                    value={formValues.name}
                    onChange={handleFieldChange('name')}
                    autoComplete="name"
                    required
                  />
                ) : null}

                <TextField
                  type="email"
                  label="Email address"
                  value={formValues.email}
                  onChange={handleFieldChange('email')}
                  autoComplete="email"
                  required
                />

                <TextField
                  type="password"
                  label="Password"
                  value={formValues.password}
                  onChange={handleFieldChange('password')}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  helperText={mode === 'signup' ? 'Use at least 6 characters.' : ' '}
                  required
                />

                <Button type="submit" size="large" variant="contained" disabled={isSubmitting}>
                  {isSubmitting
                    ? mode === 'login'
                      ? 'Signing in...'
                      : 'Creating account...'
                    : mode === 'login'
                      ? 'Login'
                      : 'Create account'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
