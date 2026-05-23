import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Heart, Mail, Lock, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { login, clearError } from '../../store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated, user } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

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
    if (!form.email || !form.password) return toast.error('Please fill all fields')
    dispatch(login(form))
  }

  const fillDemo = (role) => {
    const demos = {
      patient: { email: 'patient@demo.com', password: 'demo1234' },
      doctor: { email: 'doctor@demo.com', password: 'demo1234' },
      admin: { email: 'admin@demo.com', password: 'demo1234' }
    }
    setForm(demos[role])
    toast.success(`${role} demo credentials filled!`)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-teal-500 to-blue-500 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white animate-float"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>
        <div className="relative text-white text-center">
          <Heart size={64} className="mx-auto mb-6 fill-white/20" />
          <h2 className="font-display text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-white/80 text-lg max-w-sm">Track your health journey with personalized diet plans and real-time monitoring.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {['Meals', 'Water', 'BMI'].map(item => (
              <div key={item} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <p className="font-semibold text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access your dashboard.</p>
          </div>

          {/* Demo buttons */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {['patient', 'doctor', 'admin'].map(role => (
              <button key={role} onClick={() => fillDemo(role)}
                className="btn-secondary text-xs py-2 capitalize hover:border-primary-400 hover:text-primary-600">
                Demo {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
