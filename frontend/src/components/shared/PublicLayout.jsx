import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PublicLayout() {
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardRoute = user?.role ? `/${user.role}/dashboard` : '/dashboard'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <Heart size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">NutriTrack</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium">Home</Link>
            <a href="#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium">Features</a>
            {isAuthenticated ? (
              <button onClick={() => navigate(dashboardRoute)} className="btn-primary text-sm py-2 px-4">
                Go to Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </div>
            )}
          </div>

          <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-gray-800 pt-3">
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2" onClick={() => setMobileOpen(false)}>Home</Link>
            {isAuthenticated ? (
              <button onClick={() => { navigate(dashboardRoute); setMobileOpen(false) }} className="btn-primary text-sm py-2">Dashboard</button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  )
}
