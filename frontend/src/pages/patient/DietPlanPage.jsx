import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ClipboardList, Calendar, CheckCircle2, Circle, User, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchDietPlans } from '../../store/slices/dietPlanSlice'
import api from '../../utils/api'
import { formatDate, getMealTypeIcon, capitalize } from '../../utils/helpers'

export default function DietPlanPage() {
  const dispatch = useDispatch()
  const { plans, loading } = useSelector(s => s.dietPlans)
  const [expanded, setExpanded] = useState(null)
  const [completingMeal, setCompletingMeal] = useState(null)

  useEffect(() => { dispatch(fetchDietPlans()) }, [])

  const handleMarkComplete = async (planId, mealId) => {
    setCompletingMeal(mealId)
    try {
      await api.patch(`/diet-plans/${planId}/meals/${mealId}/complete`)
      dispatch(fetchDietPlans())
      toast.success('Meal status updated!')
    } catch { toast.error('Failed to update') }
    finally { setCompletingMeal(null) }
  }

  const getProgress = (plan) => {
    if (!plan.meals?.length) return 0
    const done = plan.meals.filter(m => m.isCompleted).length
    return Math.round((done / plan.meals.length) * 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Diet Plans</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Diet plans assigned by your doctor</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-40 skeleton rounded-2xl" />)}</div>
      ) : plans.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <ClipboardList size={56} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">No diet plans yet</p>
          <p className="text-gray-400 text-sm mt-2">Your doctor will assign a personalized diet plan for you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, i) => {
            const progress = getProgress(plan)
            const isExpanded = expanded === plan._id
            return (
              <motion.div key={plan._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden">
                {/* Plan Header */}
                <div className="p-6 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : plan._id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <ClipboardList size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{plan.title}</h3>
                        <span className={`badge ${plan.status === 'active' ? 'badge-green' : plan.status === 'completed' ? 'badge-blue' : 'badge-orange'}`}>
                          {plan.status}
                        </span>
                      </div>
                      {plan.createdBy && (
                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                          <User size={12} /> Dr. {plan.createdBy.name}
                          {plan.createdBy.specialization && ` • ${plan.createdBy.specialization}`}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar size={12} />
                          {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                        </div>
                        {plan.totalCalories > 0 && (
                          <span className="text-xs text-orange-500 font-medium">🔥 {plan.totalCalories} kcal/day</span>
                        )}
                      </div>
                      {/* Progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Today's progress</span>
                          <span className="font-medium text-primary-500">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill bg-gradient-to-r from-primary-500 to-teal-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <button className="flex-shrink-0 text-gray-400">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 dark:border-gray-800 p-6 space-y-6">
                    {/* Meals */}
                    {plan.meals?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Scheduled Meals</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {plan.meals.map(meal => (
                            <div key={meal._id} className={`p-4 rounded-xl border-2 transition-all ${meal.isCompleted ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{getMealTypeIcon(meal.mealType)}</span>
                                  <div>
                                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200 capitalize">{meal.mealType}</p>
                                    {meal.time && <p className="text-xs text-gray-400">{meal.time}</p>}
                                  </div>
                                </div>
                                <button onClick={() => handleMarkComplete(plan._id, meal._id)}
                                  disabled={completingMeal === meal._id}
                                  className={`transition-colors ${meal.isCompleted ? 'text-primary-500' : 'text-gray-300 hover:text-primary-400'}`}>
                                  {meal.isCompleted ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                </button>
                              </div>
                              {meal.foods?.length > 0 && (
                                <ul className="space-y-1 mt-2">
                                  {meal.foods.map((f, fi) => (
                                    <li key={fi} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                                      <span>{f.name} {f.quantity}{f.unit || 'g'}</span>
                                      <span className="text-orange-500 font-medium">{f.calories} kcal</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {meal.notes && <p className="text-xs text-gray-400 mt-2 italic">💡 {meal.notes}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutritional Advice */}
                    {plan.nutritionalAdvice?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Doctor's Advice</h4>
                        <ul className="space-y-2">
                          {plan.nutritionalAdvice.map((advice, ai) => (
                            <li key={ai} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <span className="text-primary-500 mt-0.5">💚</span>
                              {advice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Restrictions */}
                    {plan.restrictions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Dietary Restrictions</h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.restrictions.map((r, ri) => (
                            <span key={ri} className="badge badge-red">⚠️ {r}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.goals && (
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                        <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">🎯 Plan Goal</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{plan.goals}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
