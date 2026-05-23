import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList, Droplets,
  Scale, BarChart3, User, Users, FilePlus, LogOut,
  Shield, UserCog, Activity, Heart
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import { setMobileSidebar } from '../../store/slices/uiSlice'

const navConfig = {
  patient: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/patient/dashboard' },
    { icon: UtensilsCrossed, label: 'Meals', to: '/patient/meals' },
    { icon: ClipboardList, label: 'Diet Plan', to: '/patient/diet-plan' },
    { icon: Droplets, label: 'Water Tracker', to: '/patient/water' },
    { icon: Scale, label: 'BMI Tracker', to: '/patient/bmi' },
    { icon: BarChart3, label: 'Reports', to: '/patient/reports' },
    { icon: User, label: 'Profile', to: '/patient/profile' },
  ],
  doctor: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/doctor/dashboard' },
    { icon: Users, label: 'My Patients', to: '/doctor/patients' },
    { icon: FilePlus, label: 'Create Diet Plan', to: '/doctor/diet-plans/create' },
    { icon: BarChart3, label: 'Reports', to: '/doctor/reports' },
    { icon: User, label: 'Profile', to: '/doctor/profile' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: UserCog, label: 'User Management', to: '/admin/users' },
    { icon: User, label: 'Profile', to: '/admin/profile' },
  ]
}

export default function Sidebar({ role }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { mobileSidebarOpen } = useSelector(s => s.ui)
  const { user } = useSelector(s => s.auth)
  const links = navConfig[role] || []

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const roleColors = {
    patient: 'from-primary-500 to-teal-500',
    doctor: 'from-blue-500 to-indigo-500',
    admin: 'from-purple-500 to-pink-500'
  }

  const roleIcons = { patient: Heart, doctor: Activity, admin: Shield }
  const RoleIcon = roleIcons[role] || Heart

  return (
    <AnimatePresence>
      <motion.aside
        initial={false}
        className={`
          fixed lg:relative z-30 h-full w-72 flex-shrink-0
          bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          flex flex-col transition-transform duration-300
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[role]} flex items-center justify-center shadow-lg`}>
              <RoleIcon size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight">NutriTrack</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role} Portal</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-3">Navigation</p>
          {links.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => dispatch(setMobileSidebar(false))}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-white' : ''} />
                  <span className="font-medium text-sm">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
