import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchTodaySummary = createAsyncThunk('meals/todaySummary', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/meals/today-summary')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchMeals = createAsyncThunk('meals/fetchMeals', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/meals', { params })
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const fetchWeeklyData = createAsyncThunk('meals/weeklyData', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/meals/weekly')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const addMeal = createAsyncThunk('meals/addMeal', async (mealData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/meals', mealData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const updateMeal = createAsyncThunk('meals/updateMeal', async ({ id, data: mealData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/meals/${id}`, mealData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const deleteMeal = createAsyncThunk('meals/deleteMeal', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/meals/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const mealSlice = createSlice({
  name: 'meals',
  initialState: {
    meals: [],
    todaySummary: null,
    weeklyData: [],
    loading: false,
    error: null,
    total: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaySummary.fulfilled, (state, { payload }) => {
        state.todaySummary = payload
      })
      .addCase(fetchMeals.pending, (state) => { state.loading = true })
      .addCase(fetchMeals.fulfilled, (state, { payload }) => {
        state.loading = false
        state.meals = payload.meals
        state.total = payload.total
      })
      .addCase(fetchMeals.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload
      })
      .addCase(fetchWeeklyData.fulfilled, (state, { payload }) => {
        state.weeklyData = payload.weeklyData
      })
      .addCase(addMeal.fulfilled, (state, { payload }) => {
        state.meals.unshift(payload.meal)
      })
      .addCase(updateMeal.fulfilled, (state, { payload }) => {
        const idx = state.meals.findIndex(m => m._id === payload.meal._id)
        if (idx !== -1) state.meals[idx] = payload.meal
      })
      .addCase(deleteMeal.fulfilled, (state, { payload }) => {
        state.meals = state.meals.filter(m => m._id !== payload)
      })
  }
})

export default mealSlice.reducer
