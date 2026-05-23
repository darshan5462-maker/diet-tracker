import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, Stethoscope, UtensilsCrossed, ClipboardList, Flame, TrendingUp, Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import api from '../../utils/api'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [growth, setGrowth] = useState([])
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, gRes, uRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/user-growth'),
          api.get('/admin/users', { params: { page: 1, limit: 6 } })
        ])
        setStats(sRes.data.stats)
        setGrowth(gRes.data.data)
        setRecentUsers(uRes.data.users)
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
    { label: 'Total Patients', value: stats.totalPatients, icon: UserCheck, color: 'from-primary-500 to-teal-500', bg: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-500' },
    { label: 'Doctors', value: stats.totalDoctors, icon: Stethoscope, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500' },
    { label: 'Meals Tracked', value: stats.totalMeals.toLocaleString(), icon: UtensilsCrossed, color: 'from-orange-400 to-red-400', bg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-500' },
    { label: 'Diet Plans', value: stats.totalDietPlans, icon: ClipboardList, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-900/20', iconColor: 'text-teal-500' },
    { label: 'New This Month', value: stats.newUsersThisMonth, icon: TrendingUp, color: 'from-rose-500 to-pink-500', bg: 'bg-rose-50 dark:bg-rose-900/20', iconColor: 'text-rose-500' },
    { label: "Today's Calories", value: stats.caloriesToday.toLocaleString(), icon: Flame, color: 'from-amber-400 to-orange-400', bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-500' },
  ] : []

  const roleColors = { patient: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400', doctor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield size={24} className="text-purple-500" /> Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">System overview and management</p>
        </div>
        <Link to="/admin/users" className="btn-primary text-sm flex items-center gap-2">
          <Users size={16} /> Manage Users
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card p-5 hover:shadow-xl transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-6">User Growth (12 Months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={growth} margin={{ left: -20, right: 5 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#userGrad)" dot={{ fill: '#8b5cf6', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-6">User Role Distribution</h2>
          {stats && (
            <div className="space-y-4 mt-4">
              {[
                { label: 'Patients', count: stats.totalPatients, total: stats.totalUsers, color: 'from-primary-500 to-teal-500' },
                { label: 'Doctors', count: stats.totalDoctors, total: stats.totalUsers, color: 'from-blue-500 to-indigo-500' },
                { label: 'Admins', count: stats.totalUsers - stats.totalPatients - stats.totalDoctors, total: stats.totalUsers, color: 'from-purple-500 to-pink-500' },
              ].map(({ label, count, total, color }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                      <span className="text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="progress-bar h-3">
                      <motion.div className={`progress-fill bg-gradient-to-r ${color}`}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Users */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Users</h2>
          <Link to="/admin/users" className="text-sm text-primary-500 font-medium hover:text-primary-600">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['User', 'Email', 'Role', 'Joined', 'Status'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : u.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-primary-500 to-teal-500'}`}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-28">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 text-xs truncate max-w-36">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`badge text-xs capitalize ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`badge text-xs ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
