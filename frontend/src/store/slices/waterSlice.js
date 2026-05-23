import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchTodayWater = createAsyncThunk('water/today', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/water/today')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const addWater = createAsyncThunk('water/add', async (waterData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/water', waterData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchWeeklyWater = createAsyncThunk('water/weekly', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/water/weekly')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const waterSlice = createSlice({
  name: 'water',
  initialState: { today: null, weekly: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayWater.fulfilled, (state, { payload }) => { state.today = payload.water })
      .addCase(addWater.fulfilled, (state, { payload }) => { state.today = payload.water })
      .addCase(fetchWeeklyWater.fulfilled, (state, { payload }) => { state.weekly = payload.weeklyData })
  }
})

export default waterSlice.reducer
