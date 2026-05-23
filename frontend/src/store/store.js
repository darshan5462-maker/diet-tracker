import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import mealReducer from './slices/mealSlice'
import waterReducer from './slices/waterSlice'
import bmiReducer from './slices/bmiSlice'
import dietPlanReducer from './slices/dietPlanSlice'
import notificationReducer from './slices/notificationSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    meals: mealReducer,
    water: waterReducer,
    bmi: bmiReducer,
    dietPlans: dietPlanReducer,
    notifications: notificationReducer,
    ui: uiReducer
  }
})
