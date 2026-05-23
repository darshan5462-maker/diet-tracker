import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Save, Loader, ClipboardList, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { createDietPlan } from '../../store/slices/dietPlanSlice'
import api from '../../utils/api'
import { getMealTypeIcon } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

const emptyMeal = () => ({
  mealType: 'breakfast', time: '', notes: '',
  foods: [{ name: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 }]
})

export default function CreateDietPlanPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.dietPlans)
  const [patients, setPatients] = useState([])
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    meals: [emptyMeal()],
    nutritionalAdvice: [''],
    restrictions: [''],
    goals: '', totalCalories: 0
  })

  useEffect(() => {
    api.get('/users/patients').then(r => setPatients(r.data.patients || []))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Meals
  const addMeal = () => set('meals', [...form.meals, emptyMeal()])
  const removeMeal = (i) => set('meals', form.meals.filter((_, idx) => idx !== i))
  const updateMeal = (i, k, v) => {
    const meals = [...form.meals]
    meals[i] = { ...meals[i], [k]: v }
    set('meals', meals)
  }

  // Foods within a meal
  const addFood = (mealIdx) => {
    const meals = [...form.meals]
    meals[mealIdx].foods.push({ name: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fat: 0 })
    set('meals', meals)
  }
  const removeFood = (mealIdx, foodIdx) => {
    const meals = [...form.meals]
    meals[mealIdx].foods = meals[mealIdx].foods.filter((_, i) => i !== foodIdx)
    set('meals', meals)
  }
  const updateFood = (mealIdx, foodIdx, k, v) => {
    const meals = JSON.parse(JSON.stringify(form.meals))
    meals[mealIdx].foods[foodIdx][k] = k === 'name' || k === 'unit' ? v : Number(v)
    set('meals', meals)
  }

  // Advice & Restrictions
  const addAdvice = () => set('nutritionalAdvice', [...form.nutritionalAdvice, ''])
  const updateAdvice = (i, v) => { const a = [...form.nutritionalAdvice]; a[i] = v; set('nutritionalAdvice', a) }
  const removeAdvice = (i) => set('nutritionalAdvice', form.nutritionalAdvice.filter((_, idx) => idx !== i))

  const addRestriction = () => set('restrictions', [...form.restrictions, ''])
  const updateRestriction = (i, v) => { const r = [...form.restrictions]; r[i] = v; set('restrictions', r) }
  const removeRestriction = (i) => set('restrictions', form.restrictions.filter((_, idx) => idx !== i))

  const totalCals = form.meals.reduce((sum, meal) =>
    sum + meal.foods.reduce((s, f) => s + (Number(f.calories) || 0), 0), 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return toast.error('Enter a plan title')
    if (!form.startDate || !form.endDate) return toast.error('Set start and end dates')
    const payload = {
      ...form,
      totalCalories: totalCals,
      nutritionalAdvice: form.nutritionalAdvice.filter(a => a.trim()),
      restrictions: form.restrictions.filter(r => r.trim()),
      meals: form.meals.map(m => ({ ...m, foods: m.foods.filter(f => f.name.trim()) }))
    }
    try {
      await dispatch(createDietPlan(payload)).unwrap()
      toast.success('Diet plan created successfully! 🎉')
      navigate('/doctor/patients')
    } catch (err) { toast.error(err || 'Failed to create plan') }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Create Diet Plan</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Design a personalized nutrition plan for your patient</p>
        </div>
        {totalCals > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl text-center">
            <p className="text-xs text-gray-500">Total Daily</p>
            <p className="text-xl font-bold text-orange-500">{totalCals} kcal</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="section-title flex items-center gap-2">
            <ClipboardList size={18} className="text-primary-500" /> Plan Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Plan Title *</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                className="input-field" placeholder="e.g. Weight Loss Plan - Week 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Assign to Patient</label>
              <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} className="input-field">
                <option value="">Select patient (optional)</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name} — {p.email}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">End Date *</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="input-field resize-none h-20" placeholder="Overview of this diet plan..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Plan Goals</label>
            <input type="text" value={form.goals} onChange={e => set('goals', e.target.value)}
              className="input-field" placeholder="e.g. Lose 5kg in 30 days through caloric deficit" />
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Meals Schedule</h2>
            <button type="button" onClick={addMeal} className="btn-secondary flex items-center gap-2 text-sm py-2">
              <Plus size={16} /> Add Meal
            </button>
          </div>

          {form.meals.map((meal, mealIdx) => (
            <motion.div key={mealIdx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 space-y-4">
              {/* Meal Header */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex gap-2">
                  {MEAL_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => updateMeal(mealIdx, 'mealType', t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${meal.mealType === t ? 'bg-primary-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                      {getMealTypeIcon(t)} {t}
                    </button>
                  ))}
                </div>
                <input type="time" value={meal.time} onChange={e => updateMeal(mealIdx, 'time', e.target.value)}
                  className="input-field py-1.5 px-3 w-32 text-sm" />
                <div className="ml-auto">
                  <button type="button" onClick={() => removeMeal(mealIdx)}
                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Foods */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Food Items</p>
                {meal.foods.map((food, foodIdx) => (
                  <div key={foodIdx} className="grid grid-cols-12 gap-2 items-center">
                    <input type="text" value={food.name} onChange={e => updateFood(mealIdx, foodIdx, 'name', e.target.value)}
                      className="input-field col-span-3 text-sm py-2" placeholder="Food name" />
                    <input type="number" value={food.quantity} onChange={e => updateFood(mealIdx, foodIdx, 'quantity', e.target.value)}
                      className="input-field col-span-1 text-sm py-2 text-center" placeholder="Qty" min="0" />
                    <select value={food.unit} onChange={e => updateFood(mealIdx, foodIdx, 'unit', e.target.value)}
                      className="input-field col-span-1 text-sm py-2">
                      <option value="g">g</option><option value="ml">ml</option>
                      <option value="pcs">pcs</option><option value="cup">cup</option>
                      <option value="tbsp">tbsp</option><option value="tsp">tsp</option>
                    </select>
                    <input type="number" value={food.calories} onChange={e => updateFood(mealIdx, foodIdx, 'calories', e.target.value)}
                      className="input-field col-span-2 text-sm py-2 text-center" placeholder="Kcal" min="0" />
                    <input type="number" value={food.protein} onChange={e => updateFood(mealIdx, foodIdx, 'protein', e.target.value)}
                      className="input-field col-span-1 text-sm py-2 text-center" placeholder="P(g)" min="0" />
                    <input type="number" value={food.carbs} onChange={e => updateFood(mealIdx, foodIdx, 'carbs', e.target.value)}
                      className="input-field col-span-1 text-sm py-2 text-center" placeholder="C(g)" min="0" />
                    <input type="number" value={food.fat} onChange={e => updateFood(mealIdx, foodIdx, 'fat', e.target.value)}
                      className="input-field col-span-1 text-sm py-2 text-center" placeholder="F(g)" min="0" />
                    <button type="button" onClick={() => removeFood(mealIdx, foodIdx)}
                      className="col-span-1 text-red-400 hover:text-red-600 flex items-center justify-center">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="flex-1 grid grid-cols-12 gap-2 px-1">
                    <span className="col-span-3">Name</span><span className="col-span-1 text-center">Qty</span>
                    <span className="col-span-1 text-center">Unit</span><span className="col-span-2 text-center">Kcal</span>
                    <span className="col-span-1 text-center">Prot</span><span className="col-span-1 text-center">Carb</span>
                    <span className="col-span-1 text-center">Fat</span>
                  </span>
                </div>
                <button type="button" onClick={() => addFood(mealIdx)}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                  <Plus size={14} /> Add food item
                </button>
              </div>

              {/* Meal total */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                <input type="text" value={meal.notes} onChange={e => updateMeal(mealIdx, 'notes', e.target.value)}
                  className="input-field flex-1 mr-4 text-sm py-2" placeholder="Meal notes (optional)" />
                <span className="text-sm font-bold text-orange-500 flex-shrink-0">
                  {meal.foods.reduce((s, f) => s + (Number(f.calories) || 0), 0)} kcal
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nutritional Advice */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="section-title">Nutritional Advice</h2>
          {form.nutritionalAdvice.map((advice, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={advice} onChange={e => updateAdvice(i, e.target.value)}
                className="input-field flex-1" placeholder="e.g. Drink 8 glasses of water daily" />
              <button type="button" onClick={() => removeAdvice(i)} className="text-red-400 hover:text-red-600 p-2">
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addAdvice} className="text-sm text-primary-500 font-medium flex items-center gap-1">
            <Plus size={14} /> Add advice
          </button>
        </div>

        {/* Restrictions */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="section-title">Dietary Restrictions</h2>
          {form.restrictions.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={r} onChange={e => updateRestriction(i, e.target.value)}
                className="input-field flex-1" placeholder="e.g. No sugar, Avoid processed foods" />
              <button type="button" onClick={() => removeRestriction(i)} className="text-red-400 hover:text-red-600 p-2">
                <X size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addRestriction} className="text-sm text-primary-500 font-medium flex items-center gap-1">
            <Plus size={14} /> Add restriction
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <><Loader size={16} className="animate-spin" /> Creating...</> : <><Save size={16} /> Create Diet Plan ({totalCals} kcal)</>}
          </button>
        </div>
      </form>
    </div>
  )
}
