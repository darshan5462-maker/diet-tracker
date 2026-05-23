import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    sidebarOpen: true,
    mobileSidebarOpen: false
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    toggleMobileSidebar: (state) => { state.mobileSidebarOpen = !state.mobileSidebarOpen },
    setMobileSidebar: (state, { payload }) => { state.mobileSidebarOpen = payload }
  }
})

export const { toggleDarkMode, toggleSidebar, toggleMobileSidebar, setMobileSidebar } = uiSlice.actions
export default uiSlice.reducer
