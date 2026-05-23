import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchLatestBMI = createAsyncThunk('bmi/latest', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bmi/latest')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchBMIHistory = createAsyncThunk('bmi/history', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bmi/history')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const calculateBMI = createAsyncThunk('bmi/calculate', async (bmiData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bmi', bmiData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const bmiSlice = createSlice({
  name: 'bmi',
  initialState: { latest: null, history: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestBMI.fulfilled, (state, { payload }) => { state.latest = payload.bmi })
      .addCase(fetchBMIHistory.fulfilled, (state, { payload }) => { state.history = payload.records })
      .addCase(calculateBMI.fulfilled, (state, { payload }) => {
        state.latest = payload.bmi
        state.history.unshift(payload.bmi)
      })
  }
})

export default bmiSlice.reducer
