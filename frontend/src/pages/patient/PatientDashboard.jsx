import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Flame, Droplets, Scale, TrendingUp, Apple, Zap,
  Target, Award, ChevronRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { fetchTodaySummary, fetchWeeklyData } from '../../store/slices/mealSlice'
import { fetchTodayWater } from '../../store/slices/waterSlice'
import { fetchLatestBMI } from '../../store/slices/bmiSlice'
import { Link } from 'react-router-dom'
import { getProgressColor, getMealTypeIcon, getBMIBg, capitalize } from '../../utils/helpers'

const MACRO_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

export default function PatientDashboard() {
  const dispatch = useDispatch()
  const { todaySummary, weeklyData, loading } = useSelector(s => s.meals)
  const { today: water } = useSelector(s => s.water)
  const { latest: bmi } = useSelector(s => s.bmi)
  const { user } = useSelector(s => s.auth)

  useEffect(() => {
    dispatch(fetchTodaySummary())
    dispatch(fetchWeeklyData())
    dispatch(fetchTodayWater())
    dispatch(fetchLatestBMI())
  }, [])

  const goal = user?.dailyCalorieGoal || 2000
  const consumed = todaySummary?.summary?.calories || 0
  const remaining = Math.max(0, goal - consumed)
  const caloriePercent = Math.min(100, Math.round((consumed / goal) * 100))
  const waterGoal = user?.dailyWaterGoal || 8
  const waterConsumed = water?.glasses || 0
  const waterPercent = Math.min(100, Math.round((waterConsumed / waterGoal) * 100))

  const macros = [
    { name: 'Protein', value: Math.round(todaySummary?.summary?.protein || 0), color: '#22c55e' },
    { name: 'Carbs', value: Math.round(todaySummary?.summary?.carbs || 0), color: '#3b82f6' },
    { name: 'Fat', value: Math.round(todaySummary?.summary?.fat || 0), color: '#f59e0b' },
    { name: 'Sugar', value: Math.round(todaySummary?.summary?.sugar || 0), color: '#ef4444' },
  ]

  const statsCards = [
    {
      label: 'Calories Consumed', value: consumed.toLocaleString(), unit: 'kcal',
      icon: Flame, color: 'from-orange-400 to-red-400', bg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500', progress: caloriePercent
    },
    {
      label: 'Remaining Calories', value: remaining.toLocaleString(), unit: 'kcal',
      icon: Target, color: 'from-primary-500 to-teal-500', bg: 'bg-primary-50 dark:bg-primary-900/20',
      iconColor: 'text-primary-500', progress: 100 - caloriePercent
    },
    {
      label: 'Water Intake', value: waterConsumed.toFixed(1), unit: `/ ${waterGoal} glasses`,
      icon: Droplets, color: 'from-blue-400 to-cyan-400', bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500', progress: waterPercent
    },
    {
      label: 'Current BMI', value: bmi?.bmi || '--', unit: bmi?.category || 'Not measured',
      icon: Scale, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500', progress: null
    },
  ]

  const mealBreakdown = [
    { type: 'breakfast', calories: todaySummary?.byType?.breakfast || 0 },
    { type: 'lunch', calories: todaySummary?.byType?.lunch || 0 },
    { type: 'dinner', calories: todaySummary?.byType?.dinner || 0 },
    { type: 'snack', calories: todaySummary?.byType?.snack || 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Health Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/patient/meals" className="btn-primary flex items-center gap-2 text-sm hidden sm:flex">
          <Apple size={16} /> Log Meal
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon size={20} className={card.iconColor} />
              </div>
              {bmi && card.label === 'Current BMI' && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getBMIBg(bmi?.bmi)}`}>
                  {bmi.category}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.unit}</p>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">{card.label}</p>
            {card.progress !== null && (
              <div className="mt-3 progress-bar">
                <div
                  className={`progress-fill bg-gradient-to-r ${card.color}`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Calories */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Weekly Calorie Intake</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 7 days overview</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
              <TrendingUp size={14} className="text-primary-500" />
              Weekly
            </div>
          </div>
          {loading ? (
            <div className="h-48 skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v} kcal`, 'Calories']}
                />
                <Area type="monotone" dataKey="calories" stroke="#22c55e" strokeWidth={2.5} fill="url(#calGrad)" dot={{ fill: '#22c55e', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Macro Pie */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-1">Today's Macros</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Nutritional breakdown</p>
          {macros.every(m => m.value === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <Apple size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No meals logged yet</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={macros} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {macros.map((m, i) => <Cell key={m.name} fill={m.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}g`, '']} />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meal Breakdown */}
        <div className="glass-card p-6">
          <h2 className="section-title mb-4">Today's Meal Breakdown</h2>
          <div className="space-y-4">
            {mealBreakdown.map(({ type, calories }) => {
              const pct = goal > 0 ? Math.min(100, (calories / goal) * 100) : 0
              const colors = { breakfast: 'from-orange-400 to-amber-400', lunch: 'from-primary-500 to-teal-500', dinner: 'from-blue-500 to-indigo-500', snack: 'from-purple-500 to-pink-500' }
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getMealTypeIcon(type)}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{calories} kcal</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill bg-gradient-to-r ${colors[type]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <Link to="/patient/meals" className="mt-4 flex items-center justify-end gap-1 text-sm text-primary-500 font-medium hover:text-primary-600">
            Add meal <ChevronRight size={16} />
          </Link>
        </div>

        {/* Water Tracker Widget */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Water Intake</h2>
            <Link to="/patient/water" className="text-sm text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1">
              Track <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-gray-700" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="url(#waterGrad)" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - waterPercent / 100)}`}
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets size={20} className="text-blue-500 mb-0.5" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">{waterPercent}%</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{waterConsumed.toFixed(1)}</p>
                <p className="text-sm text-gray-500">of {waterGoal} glasses</p>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: waterGoal }, (_, i) => (
                  <div key={i} className={`h-7 rounded-lg flex items-center justify-center text-xs ${i < waterConsumed ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    💧
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      {todaySummary?.meals?.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Today's Meals</h2>
            <Link to="/patient/meals" className="text-sm text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todaySummary.meals.slice(0, 6).map((meal) => {
              const colors = { breakfast: 'from-orange-400 to-amber-400', lunch: 'from-primary-500 to-teal-500', dinner: 'from-blue-500 to-indigo-500', snack: 'from-purple-500 to-pink-500' }
              return (
                <div key={meal._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors[meal.mealType]} flex items-center justify-center flex-shrink-0 text-base`}>
                    {getMealTypeIcon(meal.mealType)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{meal.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{meal.mealType}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">{meal.totalCalories} <span className="text-xs font-normal text-gray-400">kcal</span></span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
