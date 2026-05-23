import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, User, Mail, Scale, Target, Activity, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { formatDate, getBMIBg, capitalize } from '../../utils/helpers'

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [details, setDetails] = useState({})

  useEffect(() => {
    api.get('/users/patients').then(r => setPatients(r.data.patients || [])).finally(() => setLoading(false))
  }, [])

  const loadDetails = async (id) => {
    if (details[id]) return
    try {
      const { data } = await api.get(`/users/patients/${id}`)
      setDetails(d => ({ ...d, [id]: data }))
    } catch { }
  }

  const handleExpand = (id) => {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    loadDetails(id)
  }

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Patients</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{patients.length} patients assigned to you</p>
        </div>
        <Link to="/doctor/diet-plans/create" className="btn-primary flex items-center gap-2 self-start sm:self-auto text-sm">
          <ClipboardList size={16} /> Create Diet Plan
        </Link>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search patients by name or email..." />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Users size={56} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{search ? 'No patients match your search' : 'No patients assigned yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((patient, i) => {
            const isExpanded = expanded === patient._id
            const det = details[patient._id]
            return (
              <motion.div key={patient._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden">
                <div className="p-5 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  onClick={() => handleExpand(patient._id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                      {patient.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{patient.name}</h3>
                        {patient.goal && (
                          <span className="badge badge-green text-xs">{capitalize(patient.goal)}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {patient.email}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400 flex-wrap">
                        {patient.height && <span>📏 {patient.height}cm</span>}
                        {patient.weight && <span>⚖️ {patient.weight}kg</span>}
                        {patient.gender && <span>{patient.gender === 'male' ? '👨' : '👩'} {capitalize(patient.gender)}</span>}
                        {patient.activityLevel && <span>🏃 {capitalize(patient.activityLevel)}</span>}
                      </div>
                    </div>
                    <button className="text-gray-400 flex-shrink-0">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-800/20">
                    {!det ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* BMI */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Latest BMI</p>
                          {det.latestBMI ? (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">{det.latestBMI.bmi}</span>
                              <span className={`badge text-xs ${getBMIBg(det.latestBMI.bmi)}`}>{det.latestBMI.category}</span>
                            </div>
                          ) : <p className="text-sm text-gray-400">Not measured</p>}
                        </div>

                        {/* Weekly Calories */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weekly Calories</p>
                          <p className="text-2xl font-bold text-orange-500">{det.weeklyCalories?.toLocaleString() || 0}</p>
                          <p className="text-xs text-gray-400">kcal this week</p>
                        </div>

                        {/* Recent Meals */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Meals</p>
                          {det.recentMeals?.length > 0 ? (
                            <div className="space-y-1">
                              {det.recentMeals.slice(0, 3).map(meal => (
                                <div key={meal._id} className="flex justify-between text-xs">
                                  <span className="text-gray-600 dark:text-gray-300 truncate">{meal.name}</span>
                                  <span className="text-orange-500 font-medium ml-2 flex-shrink-0">{meal.totalCalories} kcal</span>
                                </div>
                              ))}
                            </div>
                          ) : <p className="text-sm text-gray-400">No meals yet</p>}
                        </div>
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
