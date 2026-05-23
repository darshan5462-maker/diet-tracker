import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Heart, Mail, Lock, User, Stethoscope, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { register, clearError } from '../../store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', licenseNumber: '' })

  useEffect(() => {
    if (isAuthenticated && user) {
      const routes = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' }
      navigate(routes[user.role] || '/dashboard')
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()) }
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    dispatch(register(form))
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-primary-500 to-emerald-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white animate-float"
              style={{ width: `${150 + i * 50}px`, height: `${150 + i * 50}px`, left: `${i * 25}%`, top: `${i * 20}%`, animationDelay: `${i}s` }} />
          ))}
        </div>
        <div className="relative text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
            <Heart size={40} className="text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold mb-4">Join NutriTrack</h2>
          <p className="text-white/80 text-lg max-w-sm">Start your personalized health journey with doctor-guided diet plans.</p>
          <div className="mt-8 space-y-3">
            {['✅ Free patient account', '🩺 Doctor-created diet plans', '📊 Real-time analytics'].map(item => (
              <div key={item} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-sm text-left">{item}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Fill in your details to get started.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'patient', label: 'Patient', icon: User, desc: 'Track my health' },
              { id: 'doctor', label: 'Doctor / Nutritionist', icon: Stethoscope, desc: 'Manage patients' }
            ].map(({ id, label, icon: Icon, desc }) => (
              <button key={id} type="button" onClick={() => set('role', id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                <Icon size={20} className={form.role === id ? 'text-primary-500' : 'text-gray-400'} />
                <p className={`font-semibold text-sm mt-2 ${form.role === id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="input-field pl-10" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} className="input-field pl-10 pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {form.role === 'doctor' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Specialization</label>
                  <input type="text" value={form.specialization} onChange={e => set('specialization', e.target.value)} className="input-field" placeholder="e.g. Nutritionist, Dietitian" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">License Number</label>
                  <input type="text" value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} className="input-field" placeholder="Medical license number" />
                </div>
              </motion.div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:text-primary-600">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
