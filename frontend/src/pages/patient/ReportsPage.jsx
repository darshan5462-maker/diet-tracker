import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Download, Loader } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import api from '../../utils/api'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function ReportsPage() {
  const { user } = useSelector(s => s.auth)
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchReport() }, [year, month])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reports/monthly', { params: { year, month } })
      setReport(data.report)
    } catch { }
    finally { setLoading(false) }
  }

  const macroData = report ? [
    { name: 'Protein', value: Math.round(report.dailyData.reduce((s, d) => s + d.protein, 0) / Math.max(1, report.daysWithMeals)), color: '#22c55e' },
    { name: 'Carbs', value: Math.round(report.dailyData.reduce((s, d) => s + d.carbs, 0) / Math.max(1, report.daysWithMeals)), color: '#3b82f6' },
    { name: 'Fat', value: Math.round(report.dailyData.reduce((s, d) => s + d.fat, 0) / Math.max(1, report.daysWithMeals)), color: '#f59e0b' },
  ] : []

  const mealTypePie = report?.mealTypeBreakdown ? [
    { name: 'Breakfast', value: report.mealTypeBreakdown.breakfast, color: '#f59e0b' },
    { name: 'Lunch', value: report.mealTypeBreakdown.lunch, color: '#22c55e' },
    { name: 'Dinner', value: report.mealTypeBreakdown.dinner, color: '#3b82f6' },
    { name: 'Snacks', value: report.mealTypeBreakdown.snack, color: '#8b5cf6' },
  ].filter(d => d.value > 0) : []

  const statCards = report ? [
    { label: 'Total Calories', value: report.totalCalories.toLocaleString(), sub: 'kcal this month', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Daily Average', value: report.avgCalories.toLocaleString(), sub: 'kcal per day', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Water Intake', value: report.totalWater.toFixed(0), sub: `${report.avgWater} glasses/day avg`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Meals Logged', value: report.totalMeals, sub: `${report.daysWithMeals} active days`, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Health Reports</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Monthly analytics and nutrition trends</p>
        </div>
        <div className="flex gap-3">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input-field py-2 w-32">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="input-field py-2 w-24">
            {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : !report || report.totalMeals === 0 ? (
        <div className="glass-card p-16 text-center">
          <BarChart3 size={56} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No data for {MONTHS[month]} {year}</p>
          <p className="text-gray-400 text-sm mt-2">Start logging meals to see your monthly report.</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`glass-card p-5 ${s.bg}`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Daily Calorie Chart */}
          {report.dailyData.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="section-title mb-6">Daily Calorie Intake — {MONTHS[month]} {year}</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={report.dailyData} margin={{ left: -20, right: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.split('-')[2]} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(v) => [`${v} kcal`, 'Calories']} />
                  <Bar dataKey="calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Macro Averages */}
            {macroData.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="section-title mb-6">Average Daily Macros</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}g`} labelLine={false}>
                      {macroData.map((d, i) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}g`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Meal Type Distribution */}
            {mealTypePie.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="section-title mb-6">Calories by Meal Type</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={mealTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {mealTypePie.map((d) => <Cell key={d.name} fill={d.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} kcal`, '']} />
                    <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* BMI records */}
          {report.bmiRecords?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="section-title mb-4">BMI Measurements This Month</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {report.bmiRecords.map(r => (
                  <div key={r._id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{r.bmi}</p>
                        <p className="text-sm text-gray-500">{r.weight}kg • {r.height}cm</p>
                      </div>
                      <span className={`badge text-xs ${r.category === 'Normal weight' ? 'badge-green' : r.category === 'Underweight' ? 'badge-blue' : r.category === 'Overweight' ? 'badge-orange' : 'badge-red'}`}>
                        {r.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
