import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { apiClient, getAuthConfig, getErrorMessage } from '../../api/client.js'
import { logout } from '../auth/authSlice.js'

const initialState = {
  items: [],
  status: 'idle',
  createStatus: 'idle',
  error: null,
}

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, thunkApi) => {
  const token = thunkApi.getState().auth.token

  try {
    const { data } = await apiClient.get('/categories', getAuthConfig(token))
    return data.categories
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to load categories.'))
  }
})

export const createCategory = createAsyncThunk('categories/createCategory', async (payload, thunkApi) => {
  const token = thunkApi.getState().auth.token

  try {
    const { data } = await apiClient.post('/categories', payload, getAuthConfig(token))
    return data.category
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Failed to create category.'))
  }
})

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load categories.'
      })
      .addCase(createCategory.pending, (state) => {
        state.createStatus = 'loading'
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.createStatus = 'succeeded'
        state.items = [...state.items, action.payload].sort((left, right) =>
          left.name.localeCompare(right.name),
        )
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload ?? 'Failed to create category.'
      })
      .addCase(logout, () => initialState)
  },
})

export const { clearCategoryError } = categorySlice.actions

export default categorySlice.reducer
