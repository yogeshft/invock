import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiClient, getAuthConfig, getErrorMessage } from '../../api/client.js'
import { logout } from '../auth/authSlice.js'

const initialState = {
  items: [],
  status: 'idle',
  createStatus: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 6,
    totalItems: 0,
    totalPages: 1,
  },
  query: {
    search: '',
    categoryId: 'all',
    page: 1,
    limit: 6,
  },
}

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (_, thunkApi) => {
  const { auth, inventory } = thunkApi.getState()

  try {
    const { data } = await apiClient.get('/inventory', {
      ...getAuthConfig(auth.token),
      params: inventory.query,
    })
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to load inventory.'))
  }
})

export const createInventoryItem = createAsyncThunk(
  'inventory/createInventoryItem',
  async (payload, thunkApi) => {
    const token = thunkApi.getState().auth.token

    try {
      const { data } = await apiClient.post('/inventory', payload, getAuthConfig(token))
      return data.item
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to create inventory item.'))
    }
  },
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null
    },
    setInventoryQuery: (state, action) => {
      state.query = {
        ...state.query,
        ...action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items
        state.pagination = action.payload.pagination
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load inventory.'
      })
      .addCase(createInventoryItem.pending, (state) => {
        state.createStatus = 'loading'
        state.error = null
      })
      .addCase(createInventoryItem.fulfilled, (state) => {
        state.createStatus = 'succeeded'
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload ?? 'Failed to create inventory item.'
      })
      .addCase(logout, () => initialState)
  },
})

export const { clearInventoryError, setInventoryQuery } = inventorySlice.actions

export default inventorySlice.reducer
