import { useDispatch, useSelector } from 'react-redux'
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { toggleDarkMode, toggleMobileSidebar } from '../../store/slices/uiSlice'
import { fetchNotifications, markAllRead } from '../../store/slices/notificationSlice'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatTime } from '../../utils/helpers'

export default function Topbar() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector(s => s.ui)
  const { notifications, unreadCount } = useSelector(s => s.notifications)
  const { user } = useSelector(s => s.auth)
  const [showNotifs, setShowNotifs] = useState(false)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])

  const handleMarkAllRead = () => {
    dispatch(markAllRead())
  }

  const typeColors = {
    meal_reminder: 'bg-orange-100 text-orange-600',
    water_reminder: 'bg-blue-100 text-blue-600',
    diet_update: 'bg-green-100 text-green-600',
    goal_achieved: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-gray-600',
    doctor_message: 'bg-purple-100 text-purple-600'
  }

  return (
    <header className="h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="lg:hidden btn-ghost p-2"
      >
        <Menu size={20} />
      </button>

      {/* Page title area */}
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, <span className="font-semibold text-gray-900 dark:text-white">{user?.name?.split(' ')[0]}</span> 👋
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="btn-ghost p-2 rounded-xl"
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="btn-ghost p-2 rounded-xl relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-primary-500 font-medium hover:text-primary-600">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <div key={n._id} className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${typeColors[n.type] || typeColors.system}`}>
                              {n.type?.replace(/_/g, ' ')}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                            </div>
                            {!n.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
