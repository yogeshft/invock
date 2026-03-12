import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiClient, getAuthConfig, getErrorMessage } from '../../api/client.js'

const STORAGE_KEY = 'inventory-atlas-auth'

const readStoredAuth = () => {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : null
  } catch {
    return null
  }
}

const persistStoredAuth = (payload) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const storedAuth = readStoredAuth()

const initialState = {
  user: storedAuth?.user ?? null,
  token: storedAuth?.token ?? null,
  status: 'idle',
  error: null,
  initialized: !storedAuth?.token,
}

export const login = createAsyncThunk('auth/login', async (credentials, thunkApi) => {
  try {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Login failed.'))
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload, thunkApi) => {
  try {
    const { data } = await apiClient.post('/auth/signup', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Signup failed.'))
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkApi) => {
  const token = thunkApi.getState().auth.token

  if (!token) {
    return thunkApi.rejectWithValue('Authentication token is missing.')
  }

  try {
    const { data } = await apiClient.get('/auth/me', getAuthConfig(token))
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Session restore failed.'))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      state.initialized = true
      clearStoredAuth()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        persistStoredAuth({
          user: action.payload.user,
          token: action.payload.token,
        })
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed.'
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
        persistStoredAuth({
          user: action.payload.user,
          token: action.payload.token,
        })
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Signup failed.'
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.initialized = true
        persistStoredAuth({
          user: action.payload.user,
          token: state.token,
        })
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.user = null
        state.token = null
        state.error = action.payload ?? null
        state.initialized = true
        clearStoredAuth()
      })
  },
})

export const { clearAuthError, logout } = authSlice.actions

export default authSlice.reducer
