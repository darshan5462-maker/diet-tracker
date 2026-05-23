import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, TrendingUp, ClipboardList } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import api from '../../utils/api'

export default function DoctorReportsPage() {
  const [patients, setPatients] = useState([])
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/users/patients'), api.get('/diet-plans')])
      .then(([pRes, plRes]) => {
        setPatients(pRes.data.patients || [])
        setPlans(plRes.data.plans || [])
      }).finally(() => setLoading(false))
  }, [])

  const planStatusData = [
    { name: 'Active', value: plans.filter(p => p.status === 'active').length, color: '#22c55e' },
    { name: 'Completed', value: plans.filter(p => p.status === 'completed').length, color: '#3b82f6' },
    { name: 'Draft', value: plans.filter(p => p.status === 'draft').length, color: '#f59e0b' },
  ].filter(d => d.value > 0)

  const patientGoalData = [
    { name: 'Lose Weight', value: patients.filter(p => p.goal === 'lose_weight').length, color: '#ef4444' },
    { name: 'Maintain', value: patients.filter(p => p.goal === 'maintain').length, color: '#22c55e' },
    { name: 'Gain Weight', value: patients.filter(p => p.goal === 'gain_weight').length, color: '#3b82f6' },
  ].filter(d => d.value > 0)

  const monthlyPlans = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
    return {
      month: d.toLocaleDateString('en', { month: 'short' }),
      plans: plans.filter(p => {
        const pd = new Date(p.createdAt)
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear()
      }).length
    }
  })

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Diet Plans Created', value: plans.length, icon: ClipboardList, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Completion Rate', value: plans.length ? `${Math.round((plans.filter(p => p.status === 'completed').length / plans.length) * 100)}%` : '0%', icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Doctor Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your patients and diet plans</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`glass-card p-5 ${s.bg}`}>
            <s.icon size={22} className={`${s.color} mb-3`} />
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="section-title mb-6">Plans Created Per Month</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyPlans} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="plans" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-6">Plan Status Distribution</h2>
          {planStatusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No plans yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={planStatusData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {planStatusData.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip /><Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-6">Patient Goals</h2>
          {patientGoalData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No patient data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={patientGoalData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {patientGoalData.map(d => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip /><Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Patient Table */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Patient Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Patient', 'Goal', 'BMI Range', 'Status'].map(h => (
                    <th key={h} className="pb-3 pr-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 6).map(p => (
                  <tr key={p._id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {p.name?.charAt(0)}
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 truncate max-w-24">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-xs text-gray-500 capitalize">{p.goal?.replace('_', ' ') || '—'}</span>
                    </td>
                    <td className="py-3 pr-3 text-gray-500 text-xs">{p.weight && p.height ? `${(p.weight / Math.pow(p.height / 100, 2)).toFixed(1)}` : '—'}</td>
                    <td className="py-3">
                      <span className={`badge text-xs ${p.isActive ? 'badge-green' : 'badge-red'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
