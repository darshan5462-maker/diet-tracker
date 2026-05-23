export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export const getBMIColor = (bmi) => {
  if (!bmi) return 'text-gray-500'
  if (bmi < 18.5) return 'text-blue-500'
  if (bmi < 25) return 'text-green-500'
  if (bmi < 30) return 'text-orange-500'
  return 'text-red-500'
}

export const getBMIBg = (bmi) => {
  if (!bmi) return 'bg-gray-100'
  if (bmi < 18.5) return 'bg-blue-100 text-blue-700'
  if (bmi < 25) return 'bg-green-100 text-green-700'
  if (bmi < 30) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

export const getMealTypeColor = (type) => {
  const colors = {
    breakfast: 'from-orange-400 to-amber-400',
    lunch: 'from-green-500 to-emerald-500',
    dinner: 'from-blue-500 to-indigo-500',
    snack: 'from-purple-500 to-pink-500'
  }
  return colors[type] || 'from-gray-400 to-gray-500'
}

export const getMealTypeIcon = (type) => {
  const icons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  }
  return icons[type] || '🍽️'
}

export const calculateCalorieNeeds = (user) => {
  if (!user?.weight || !user?.height || !user?.dateOfBirth || !user?.gender) return user?.dailyCalorieGoal || 2000

  const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
  let bmr
  if (user.gender === 'male') {
    bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * age)
  }

  const multipliers = {
    sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55,
    very_active: 1.725, extra_active: 1.9
  }
  const tdee = bmr * (multipliers[user.activityLevel] || 1.55)

  if (user.goal === 'lose_weight') return Math.round(tdee - 500)
  if (user.goal === 'gain_weight') return Math.round(tdee + 500)
  return Math.round(tdee)
}

export const getProgressColor = (percent) => {
  if (percent >= 100) return 'from-red-500 to-rose-500'
  if (percent >= 80) return 'from-orange-400 to-amber-400'
  if (percent >= 50) return 'from-primary-500 to-teal-500'
  return 'from-primary-400 to-teal-400'
}

export const truncate = (str, n = 30) => str?.length > n ? str.slice(0, n) + '...' : str

export const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ') : ''
