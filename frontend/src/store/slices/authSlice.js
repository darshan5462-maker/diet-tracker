import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
    clearError: (state) => { state.error = null }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.token = payload.token
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload
      })
      .addCase(getMe.pending, (state) => { state.loading = true })
      .addCase(getMe.fulfilled, (state, { payload }) => {
        state.loading = false
        state.user = payload.user
        state.isAuthenticated = true
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        localStorage.removeItem('token')
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload.user
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
