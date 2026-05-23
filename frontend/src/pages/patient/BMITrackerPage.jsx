import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Scale, TrendingUp, Target, Activity } from 'lucide-react'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { calculateBMI, fetchBMIHistory, fetchLatestBMI } from '../../store/slices/bmiSlice'
import { formatDate, getBMIBg } from '../../utils/helpers'

const bmiCategories = [
  { range: '< 18.5', label: 'Underweight', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', bar: 'bg-blue-400', width: '20%' },
  { range: '18.5 - 24.9', label: 'Normal Weight', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', bar: 'bg-green-500', width: '25%' },
  { range: '25 - 29.9', label: 'Overweight', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', bar: 'bg-orange-400', width: '25%' },
  { range: '≥ 30', label: 'Obese', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', bar: 'bg-red-500', width: '30%' },
]

export default function BMITrackerPage() {
  const dispatch = useDispatch()
  const { latest, history } = useSelector(s => s.bmi)
  const { user } = useSelector(s => s.auth)
  const [form, setForm] = useState({ weight: user?.weight || '', height: user?.height || '', notes: '' })
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    dispatch(fetchLatestBMI())
    dispatch(fetchBMIHistory())
  }, [])

  const calcPreview = (w, h) => {
    if (w && h && w > 0 && h > 0) {
      const bmi = w / Math.pow(h / 100, 2)
      setPreview(Math.round(bmi * 10) / 10)
    } else setPreview(null)
  }

  const set = (k, v) => {
    const newForm = { ...form, [k]: v }
    setForm(newForm)
    calcPreview(Number(newForm.weight), Number(newForm.height))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.weight || !form.height) return toast.error('Enter weight and height')
    if (form.weight < 20 || form.weight > 300) return toast.error('Invalid weight')
    if (form.height < 100 || form.height > 250) return toast.error('Invalid height')
    try {
      await dispatch(calculateBMI({ weight: Number(form.weight), height: Number(form.height), notes: form.notes })).unwrap()
      toast.success('BMI calculated and saved! 📊')
      setPreview(null)
      dispatch(fetchBMIHistory())
    } catch (err) { toast.error(err || 'Failed to calculate BMI') }
  }

  const getBMIPosition = (bmi) => {
    if (!bmi) return 0
    const min = 15, max = 40
    return Math.min(100, Math.max(0, ((bmi - min) / (max - min)) * 100))
  }

  const chartData = [...history].reverse().map(r => ({
    date: formatDate(r.date),
    bmi: r.bmi,
    weight: r.weight
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">BMI Tracker</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your Body Mass Index and weight progress</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Scale size={20} className="text-primary-500" />
            <h2 className="section-title">BMI Calculator</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                className="input-field" placeholder="70" min="20" max="300" step="0.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Height (cm)</label>
              <input type="number" value={form.height} onChange={e => set('height', e.target.value)}
                className="input-field" placeholder="175" min="100" max="250" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (optional)</label>
              <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)}
                className="input-field" placeholder="After workout, etc." />
            </div>

            {preview && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl text-center ${getBMIBg(preview)}`}>
                <p className="text-3xl font-bold">{preview}</p>
                <p className="text-sm font-medium mt-0.5">
                  {preview < 18.5 ? 'Underweight' : preview < 25 ? 'Normal Weight' : preview < 30 ? 'Overweight' : 'Obese'}
                </p>
              </motion.div>
            )}

            <button type="submit" className="btn-primary w-full">Calculate & Save BMI</button>
          </form>
        </div>

        {/* Current BMI Display */}
        <div className="lg:col-span-2 space-y-6">
          {latest && (
            <div className="glass-card p-6">
              <h2 className="section-title mb-6">Current Status</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'BMI', value: latest.bmi, sub: latest.category, icon: Activity, color: 'text-primary-500' },
                  { label: 'Weight', value: `${latest.weight} kg`, sub: 'Last recorded', icon: Scale, color: 'text-blue-500' },
                  { label: 'Height', value: `${latest.height} cm`, sub: 'Last recorded', icon: TrendingUp, color: 'text-purple-500' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                    <s.icon size={20} className={`${s.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* BMI Scale */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">BMI Scale</p>
                <div className="relative">
                  <div className="flex rounded-full overflow-hidden h-4">
                    <div className="bg-blue-400" style={{ width: '20%' }} />
                    <div className="bg-green-500" style={{ width: '25%' }} />
                    <div className="bg-orange-400" style={{ width: '25%' }} />
                    <div className="bg-red-500" style={{ width: '30%' }} />
                  </div>
                  <motion.div
                    className="absolute -top-1 w-4 h-6 bg-white dark:bg-gray-900 border-2 border-gray-800 dark:border-white rounded-full shadow-lg -translate-x-1/2"
                    animate={{ left: `${getBMIPosition(latest.bmi)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {['15', '18.5', '25', '30', '40'].map(v => (
                    <span key={v} className="text-xs text-gray-400">{v}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {bmiCategories.map(cat => (
                    <span key={cat.label} className={`text-xs px-2 py-1 rounded-lg font-medium ${cat.color} ${latest.category === cat.label ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
                      {cat.range}: {cat.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Goal Card */}
          {user?.targetWeight && latest && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-primary-500" />
                <h3 className="section-title">Weight Goal</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Current: {latest.weight}kg</span>
                    <span className="text-primary-500 font-medium">Target: {user.targetWeight}kg</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill bg-gradient-to-r from-primary-500 to-teal-500"
                      style={{ width: `${Math.min(100, (latest.weight / user.targetWeight) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    {Math.abs(latest.weight - user.targetWeight).toFixed(1)}kg to goal
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 1 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="section-title mb-6">BMI History</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ left: -20, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <ReferenceLine y={18.5} stroke="#3b82f6" strokeDasharray="4 4" />
                <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="4 4" />
                <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="bmi" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title mb-6">Weight History</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ left: -20, right: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(v) => [`${v} kg`, 'Weight']} />
                {user?.targetWeight && <ReferenceLine y={user.targetWeight} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Target', fill: '#22c55e', fontSize: 11 }} />}
                <Line type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Measurement History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                  {['Date', 'Weight', 'Height', 'BMI', 'Category'].map(h => (
                    <th key={h} className="pb-3 pr-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((r, i) => (
                  <motion.tr key={r._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{formatDate(r.date)}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{r.weight} kg</td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{r.height} cm</td>
                    <td className="py-3 pr-4 font-bold text-gray-900 dark:text-white">{r.bmi}</td>
                    <td className="py-3"><span className={`badge text-xs ${getBMIBg(r.bmi)}`}>{r.category}</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
