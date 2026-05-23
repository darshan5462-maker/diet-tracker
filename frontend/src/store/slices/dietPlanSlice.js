import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchDietPlans = createAsyncThunk('dietPlans/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/diet-plans')
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const createDietPlan = createAsyncThunk('dietPlans/create', async (planData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/diet-plans', planData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const updateDietPlan = createAsyncThunk('dietPlans/update', async ({ id, data: planData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/diet-plans/${id}`, planData)
    return data
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

export const deleteDietPlan = createAsyncThunk('dietPlans/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/diet-plans/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data?.message) }
})

const dietPlanSlice = createSlice({
  name: 'dietPlans',
  initialState: { plans: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDietPlans.pending, (state) => { state.loading = true })
      .addCase(fetchDietPlans.fulfilled, (state, { payload }) => {
        state.loading = false; state.plans = payload.plans
      })
      .addCase(fetchDietPlans.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload
      })
      .addCase(createDietPlan.fulfilled, (state, { payload }) => {
        state.plans.unshift(payload.plan)
      })
      .addCase(updateDietPlan.fulfilled, (state, { payload }) => {
        const idx = state.plans.findIndex(p => p._id === payload.plan._id)
        if (idx !== -1) state.plans[idx] = payload.plan
      })
      .addCase(deleteDietPlan.fulfilled, (state, { payload }) => {
        state.plans = state.plans.filter(p => p._id !== payload)
      })
  }
})

export default dietPlanSlice.reducer
