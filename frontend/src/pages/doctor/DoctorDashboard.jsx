import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Users, ClipboardList, TrendingUp, Activity, ChevronRight, User, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'
import { formatDate, getBMIBg } from '../../utils/helpers'

export default function DoctorDashboard() {
  const { user } = useSelector(s => s.auth)
  const [patients, setPatients] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, plRes] = await Promise.all([
          api.get('/users/patients'),
          api.get('/diet-plans')
        ])
        setPatients(pRes.data.patients || [])
        setPlans(plRes.data.plans || [])
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const activePlans = plans.filter(p => p.status === 'active').length
  const completedPlans = plans.filter(p => p.status === 'completed').length

  const stats = [
    { label: 'My Patients', value: patients.length, icon: Users, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
    { label: 'Active Diet Plans', value: activePlans, icon: ClipboardList, color: 'from-primary-500 to-teal-500', bg: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-500' },
    { label: 'Completed Plans', value: completedPlans, icon: TrendingUp, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500' },
    { label: 'Total Plans Created', value: plans.length, icon: Activity, color: 'from-orange-400 to-red-400', bg: 'bg-orange-50 dark:bg-orange-900/20', iconColor: 'text-orange-500' },
  ]

  // Chart data: plans per month (last 6)
  const planChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleDateString('en', { month: 'short' })
    const count = plans.filter(p => {
      const pd = new Date(p.createdAt)
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()
    }).length
    return { month, plans: count }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Doctor Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, Dr. {user?.name?.split(' ')[0]}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={20} className={s.iconColor} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="section-title mb-6">Diet Plans Created (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planChartData} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="plans" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Create Diet Plan', to: '/doctor/diet-plans/create', color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400', icon: ClipboardList },
              { label: 'View All Patients', to: '/doctor/patients', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', icon: Users },
              { label: 'View Reports', to: '/doctor/reports', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', icon: TrendingUp },
            ].map(({ label, to, color, icon: Icon }) => (
              <Link key={label} to={to}
                className={`flex items-center justify-between p-4 rounded-xl ${color} hover:opacity-80 transition-opacity`}>
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-medium text-sm">{label}</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">My Patients</h2>
          <Link to="/doctor/patients" className="text-sm text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 skeleton rounded-xl" />)}</div>
        ) : patients.length === 0 ? (
          <div className="text-center py-10">
            <Users size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No patients assigned yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {patients.slice(0, 6).map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {p.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.email}</p>
                  {p.goal && <span className="text-xs text-primary-500 font-medium capitalize">{p.goal.replace('_', ' ')}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Plans */}
      {plans.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Recent Diet Plans</h2>
          <div className="space-y-3">
            {plans.slice(0, 5).map((plan, i) => (
              <div key={plan._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                    <ClipboardList size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{plan.title}</p>
                    {plan.assignedTo && <p className="text-xs text-gray-500">Assigned to: {plan.assignedTo.name}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge text-xs ${plan.status === 'active' ? 'badge-green' : plan.status === 'completed' ? 'badge-blue' : 'badge-orange'}`}>
                    {plan.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(plan.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
