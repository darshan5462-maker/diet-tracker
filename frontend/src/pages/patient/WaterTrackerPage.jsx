import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Droplets, Plus, RotateCcw, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { fetchTodayWater, addWater, fetchWeeklyWater } from '../../store/slices/waterSlice'
import api from '../../utils/api'

const QUICK_AMOUNTS = [
  { label: '1 glass', amount: 1, unit: 'glasses', ml: 250 },
  { label: '2 glasses', amount: 2, unit: 'glasses', ml: 500 },
  { label: '500ml', amount: 500, unit: 'ml', ml: 500 },
  { label: '1L', amount: 1000, unit: 'ml', ml: 1000 },
]

export default function WaterTrackerPage() {
  const dispatch = useDispatch()
  const { today, weekly } = useSelector(s => s.water)
  const { user } = useSelector(s => s.auth)
  const [customAmount, setCustomAmount] = useState('')
  const [unit, setUnit] = useState('glasses')

  useEffect(() => {
    dispatch(fetchTodayWater())
    dispatch(fetchWeeklyWater())
  }, [])

  const glasses = today?.glasses || 0
  const goal = today?.goal || user?.dailyWaterGoal || 8
  const percent = Math.min(100, Math.round((glasses / goal) * 100))
  const mlConsumed = today?.mlAmount || glasses * 250

  const handleAdd = async (amount, u) => {
    try {
      await dispatch(addWater({ amount, unit: u })).unwrap()
      toast.success(`💧 ${amount} ${u} added!`)
    } catch { toast.error('Failed to add water') }
  }

  const handleCustomAdd = () => {
    if (!customAmount || isNaN(customAmount) || Number(customAmount) <= 0) return toast.error('Enter a valid amount')
    handleAdd(Number(customAmount), unit)
    setCustomAmount('')
  }

  const handleReset = async () => {
    if (!confirm('Reset today\'s water intake?')) return
    try {
      await api.delete('/water/reset')
      dispatch(fetchTodayWater())
      toast.success('Water intake reset')
    } catch { toast.error('Failed to reset') }
  }

  const waterColor = percent < 33 ? '#ef4444' : percent < 66 ? '#f59e0b' : '#3b82f6'
  const fillLevel = Math.min(100, percent)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Water Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay hydrated throughout the day</p>
        </div>
        <button onClick={handleReset} className="btn-secondary flex items-center gap-2 text-sm">
          <RotateCcw size={15} /> Reset
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Water Visual */}
        <div className="glass-card p-8 flex flex-col items-center">
          {/* Animated water glass */}
          <div className="relative w-36 h-48 mb-6">
            <svg viewBox="0 0 120 180" className="w-full h-full">
              {/* Glass outline */}
              <path d="M20 10 L100 10 L90 170 L30 170 Z" fill="none" stroke="#e5e7eb" strokeWidth="3" strokeLinejoin="round" className="dark:stroke-gray-700" />
              {/* Water fill */}
              <clipPath id="glassClip">
                <path d="M21 10 L99 10 L89 169 L31 169 Z" />
              </clipPath>
              <motion.rect
                x="0" width="120"
                y={10 + (160 * (1 - fillLevel / 100))}
                height={160 * fillLevel / 100}
                fill={waterColor}
                fillOpacity="0.6"
                clipPath="url(#glassClip)"
                animate={{ y: 10 + (160 * (1 - fillLevel / 100)) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              {/* Water shine */}
              <motion.rect
                x="30" y={20 + (160 * (1 - fillLevel / 100))} width="8" height={Math.max(0, 120 * fillLevel / 100)}
                fill="white" fillOpacity="0.25" rx="4"
                clipPath="url(#glassClip)"
                animate={{ y: 20 + (160 * (1 - fillLevel / 100)) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900 dark:text-white mb-1">{percent}%</p>
            <p className="text-gray-500 text-sm">{glasses.toFixed(1)} / {goal} glasses</p>
            <p className="text-blue-500 font-medium text-sm mt-1">{(mlConsumed / 1000).toFixed(2)}L of {(goal * 0.25).toFixed(2)}L</p>
          </div>

          {/* Glass indicators */}
          <div className="grid grid-cols-4 gap-1.5 mt-6 w-full">
            {Array.from({ length: Math.min(goal, 12) }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8 }}
                animate={{ scale: i < glasses ? 1.05 : 1 }}
                className={`h-8 rounded-lg flex items-center justify-center text-sm transition-colors duration-300 ${i < glasses ? 'bg-blue-500 shadow-md' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                💧
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Consumed', value: `${glasses.toFixed(1)}`, sub: 'glasses', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Remaining', value: `${Math.max(0, goal - glasses).toFixed(1)}`, sub: 'glasses', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { label: 'Goal', value: `${goal}`, sub: 'glasses/day', color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
            ].map(s => (
              <div key={s.label} className={`glass-card p-4 text-center ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.sub}</p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Add */}
          <div className="glass-card p-6">
            <h3 className="section-title mb-4">Quick Add</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {QUICK_AMOUNTS.map(({ label, amount, unit: u, ml }) => (
                <button key={label} onClick={() => handleAdd(amount, u)}
                  className="py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all font-medium text-sm flex flex-col items-center gap-1">
                  <Droplets size={18} />
                  {label}
                  <span className="text-xs text-blue-400">{ml}ml</span>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)}
                  className="input-field flex-1" placeholder="Custom amount" min="0" step="0.5" />
                <select value={unit} onChange={e => setUnit(e.target.value)} className="input-field w-28">
                  <option value="glasses">glasses</option>
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                </select>
              </div>
              <button onClick={handleCustomAdd} className="btn-primary px-4 flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Recent entries */}
          {today?.entries?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="section-title mb-3">Today's Log</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                {[...today.entries].reverse().map((entry, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Droplets size={14} className="text-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{entry.amount} {entry.unit}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(entry.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Chart */}
      {weekly.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-blue-500" />
            <h2 className="section-title">Weekly Water Intake</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${v} glasses`, 'Water']} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <ReferenceLine y={weekly[0]?.goal || 8} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Goal', position: 'right', fontSize: 11, fill: '#22c55e' }} />
              <Bar dataKey="glasses" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
