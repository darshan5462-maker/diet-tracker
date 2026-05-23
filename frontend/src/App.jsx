import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { getMe } from './store/slices/authSlice'

// Layouts
import AppLayout from './components/shared/AppLayout'
import PublicLayout from './components/shared/PublicLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import MealsPage from './pages/patient/MealsPage'
import DietPlanPage from './pages/patient/DietPlanPage'
import WaterTrackerPage from './pages/patient/WaterTrackerPage'
import BMITrackerPage from './pages/patient/BMITrackerPage'
import ReportsPage from './pages/patient/ReportsPage'
import ProfilePage from './pages/patient/ProfilePage'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import PatientsPage from './pages/doctor/PatientsPage'
import CreateDietPlanPage from './pages/doctor/CreateDietPlanPage'
import DoctorReportsPage from './pages/doctor/DoctorReportsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useSelector(s => s.auth)
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector(s => s.ui)

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    const token = localStorage.getItem('token')
    if (token) dispatch(getMe())
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 !shadow-xl !rounded-xl',
          duration: 3000
        }}
      />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Patient Routes */}
        <Route element={<ProtectedRoute roles={['patient']}><AppLayout role="patient" /></ProtectedRoute>}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/meals" element={<MealsPage />} />
          <Route path="/patient/diet-plan" element={<DietPlanPage />} />
          <Route path="/patient/water" element={<WaterTrackerPage />} />
          <Route path="/patient/bmi" element={<BMITrackerPage />} />
          <Route path="/patient/reports" element={<ReportsPage />} />
          <Route path="/patient/profile" element={<ProfilePage />} />
        </Route>

        {/* Doctor Routes */}
        <Route element={<ProtectedRoute roles={['doctor']}><AppLayout role="doctor" /></ProtectedRoute>}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<PatientsPage />} />
          <Route path="/doctor/diet-plans/create" element={<CreateDietPlanPage />} />
          <Route path="/doctor/reports" element={<DoctorReportsPage />} />
          <Route path="/doctor/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={['admin']}><AppLayout role="admin" /></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>

        {/* Role-based redirect */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function RoleDashboardRedirect() {
  const { user } = useSelector(s => s.auth)
  if (!user) return <Navigate to="/login" replace />
  const routes = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
  return <Navigate to={routes[user.role] || '/login'} replace />
}
