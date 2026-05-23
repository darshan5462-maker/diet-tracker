import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Trash2, Star, Filter, Loader, X, Apple, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import { fetchMeals, addMeal, deleteMeal } from '../../store/slices/mealSlice'
import { getMealTypeIcon, getMealTypeColor, formatDate } from '../../utils/helpers'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export default function MealsPage() {
  const dispatch = useDispatch()
  const { meals, loading } = useSelector(s => s.meals)
  const [showAdd, setShowAdd] = useState(false)
  const [searchFood, setSearchFood] = useState('')
  const [foodResults, setFoodResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [form, setForm] = useState({
    name: '', mealType: 'breakfast', date: new Date().toISOString(),
    foods: [], notes: ''
  })
  const [qty, setQty] = useState(100)

  useEffect(() => {
    dispatch(fetchMeals({ date: selectedDate, mealType: filterType }))
  }, [selectedDate, filterType])

  const handleFoodSearch = useCallback(async (q) => {
    if (!q.trim()) { setFoodResults([]); return }
    setSearchLoading(true)
    try {
      const { data } = await api.get('/food/search', { params: { q } })
      setFoodResults(data.foods)
    } catch { toast.error('Food search failed') }
    finally { setSearchLoading(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => handleFoodSearch(searchFood), 400)
    return () => clearTimeout(t)
  }, [searchFood])

  const addFoodToMeal = (food) => {
    const scaled = qty / 100
    setForm(f => ({
      ...f,
      foods: [...f.foods, {
        name: food.name, quantity: qty, unit: food.unit,
        calories: Math.round(food.calories * scaled),
        protein: Math.round(food.protein * scaled * 10) / 10,
        carbs: Math.round(food.carbs * scaled * 10) / 10,
        fat: Math.round(food.fat * scaled * 10) / 10,
        sugar: Math.round(food.sugar * scaled * 10) / 10,
      }]
    }))
    setSearchFood(''); setFoodResults([])
    toast.success(`${food.name} added to meal!`)
  }

  const removeFoodItem = (idx) => {
    setForm(f => ({ ...f, foods: f.foods.filter((_, i) => i !== idx) }))
  }

  const totalCalories = form.foods.reduce((s, f) => s + f.calories, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return toast.error('Enter a meal name')
    if (form.foods.length === 0) return toast.error('Add at least one food item')
    try {
      await dispatch(addMeal(form)).unwrap()
      toast.success('Meal logged successfully! 🎉')
      setShowAdd(false)
      setForm({ name: '', mealType: 'breakfast', date: new Date().toISOString(), foods: [], notes: '' })
      dispatch(fetchMeals({ date: selectedDate }))
    } catch (err) { toast.error(err || 'Failed to add meal') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this meal?')) return
    try {
      await dispatch(deleteMeal(id)).unwrap()
      toast.success('Meal deleted')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Meal Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Log and manage your daily meals</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={18} /> Log Meal
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className="input-field w-auto text-sm py-2 px-3" />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterType('')}
            className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${filterType === '' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
            All
          </button>
          {MEAL_TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t === filterType ? '' : t)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${filterType === t ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
              {getMealTypeIcon(t)} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Meals List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : meals.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Apple size={56} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No meals logged</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Start tracking your diet by logging your first meal</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">Log Your First Meal</button>
        </div>
      ) : (
        <div className="space-y-3">
          {meals.map((meal, i) => (
            <motion.div key={meal._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getMealTypeColor(meal.mealType)} flex items-center justify-center text-xl flex-shrink-0 shadow-md`}>
                  {getMealTypeIcon(meal.mealType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{meal.name}</h3>
                    <span className="badge badge-green capitalize">{meal.mealType}</span>
                    {meal.isFavorite && <Star size={14} className="text-amber-400 fill-amber-400" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(meal.date)} • {meal.foods.length} items</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded-lg font-medium">🔥 {meal.totalCalories} kcal</span>
                    <span className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 px-2 py-1 rounded-lg">P: {Math.round(meal.totalProtein)}g</span>
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-lg">C: {Math.round(meal.totalCarbs)}g</span>
                    <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-2 py-1 rounded-lg">F: {Math.round(meal.totalFat)}g</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(meal._id)}
                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">Log New Meal</h2>
                <button onClick={() => setShowAdd(false)} className="btn-ghost p-2 rounded-xl"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-5">
                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {MEAL_TYPES.map(t => (
                      <button key={t} type="button" onClick={() => setForm(f => ({ ...f, mealType: t }))}
                        className={`py-2.5 rounded-xl text-sm font-medium capitalize flex flex-col items-center gap-1 transition-all ${form.mealType === t ? 'bg-primary-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                        <span>{getMealTypeIcon(t)}</span>
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meal Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" placeholder="e.g. Oatmeal with berries" />
                </div>

                {/* Food Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Search & Add Foods</label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={searchFood} onChange={e => setSearchFood(e.target.value)}
                        className="input-field pl-9" placeholder="Search food database..." />
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min="1"
                        className="input-field w-20 text-center text-sm" placeholder="g" />
                      <span className="text-xs text-gray-500">g</span>
                    </div>
                  </div>

                  {searchLoading && (
                    <div className="flex items-center gap-2 p-3 text-sm text-gray-500">
                      <Loader size={14} className="animate-spin" /> Searching...
                    </div>
                  )}

                  {foodResults.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      {foodResults.map(food => (
                        <button key={food.id} type="button" onClick={() => addFoodToMeal(food)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-left border-b border-gray-50 dark:border-gray-800 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{food.name}</p>
                            <p className="text-xs text-gray-500">{food.category} • per {food.unit}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <p className="text-sm font-bold text-orange-500">{Math.round(food.calories * qty / 100)} kcal</p>
                            <p className="text-xs text-gray-400">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Added Foods */}
                {form.foods.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Foods</label>
                      <span className="badge badge-orange">🔥 {totalCalories} kcal total</span>
                    </div>
                    <div className="space-y-2">
                      {form.foods.map((food, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{food.name}</p>
                            <p className="text-xs text-gray-500">{food.quantity}g • P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-orange-500">{food.calories} kcal</span>
                            <button type="button" onClick={() => removeFoodItem(i)} className="text-red-400 hover:text-red-600 transition-colors">
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (optional)</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="input-field resize-none h-20" placeholder="Any notes about this meal..." />
                </div>
              </form>

              <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  Save Meal ({totalCalories} kcal)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
