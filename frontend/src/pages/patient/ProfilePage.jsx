import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Target, Activity, Save, Lock, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice'
import api from '../../utils/api'
import { capitalize } from '../../utils/helpers'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '', phone: user?.phone || '',
    gender: user?.gender || '', dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
    height: user?.height || '', weight: user?.weight || '',
    targetWeight: user?.targetWeight || '', activityLevel: user?.activityLevel || 'moderately_active',
    goal: user?.goal || 'maintain', dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    dailyWaterGoal: user?.dailyWaterGoal || 8
  })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })

  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const setPass = (k, v) => setPasswords(p => ({ ...p, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(updateProfile(profile)).unwrap()
      toast.success('Profile updated successfully! ✅')
    } catch (err) { toast.error(err || 'Failed to update profile') }
    finally { setLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Fill both password fields')
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters')
    setPassLoading(true)
    try {
      await api.put('/auth/change-password', passwords)
      toast.success('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
    finally { setPassLoading(false) }
  }

  const roleColor = { patient: 'from-primary-500 to-teal-500', doctor: 'from-blue-500 to-indigo-500', admin: 'from-purple-500 to-pink-500' }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar & Role */}
      <div className="glass-card p-6 flex items-center gap-5">
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleColor[user?.role] || roleColor.patient} flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0`}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${user?.role === 'patient' ? 'badge-green' : user?.role === 'doctor' ? 'badge-blue' : 'badge-purple'} capitalize`}>
              {user?.role}
            </span>
            {user?.specialization && <span className="badge badge-orange">{user.specialization}</span>}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="glass-card p-6 space-y-5">
        <h2 className="section-title flex items-center gap-2"><User size={18} className="text-primary-500" /> Personal Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input type="text" value={profile.name} onChange={e => set('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
            <input type="tel" value={profile.phone} onChange={e => set('phone', e.target.value)} className="input-field" placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gender</label>
            <select value={profile.gender} onChange={e => set('gender', e.target.value)} className="input-field">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date of Birth</label>
            <input type="date" value={profile.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className="input-field" />
          </div>
        </div>

        {user?.role === 'patient' && (
          <>
            <hr className="border-gray-100 dark:border-gray-800" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"><Activity size={16} className="text-teal-500" /> Health Metrics</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: 'height', label: 'Height (cm)', placeholder: '175' },
                { k: 'weight', label: 'Weight (kg)', placeholder: '70' },
                { k: 'targetWeight', label: 'Target Weight (kg)', placeholder: '65' },
                { k: 'dailyCalorieGoal', label: 'Calorie Goal (kcal)', placeholder: '2000' },
              ].map(({ k, label, placeholder }) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <input type="number" value={profile[k]} onChange={e => set(k, e.target.value)} className="input-field" placeholder={placeholder} />
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Activity Level</label>
                <select value={profile.activityLevel} onChange={e => set('activityLevel', e.target.value)} className="input-field">
                  {['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'].map(v => (
                    <option key={v} value={v}>{capitalize(v)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Goal</label>
                <select value={profile.goal} onChange={e => set('goal', e.target.value)} className="input-field">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain">Maintain</option>
                  <option value="gain_weight">Gain Weight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Daily Water Goal (glasses)</label>
                <input type="number" value={profile.dailyWaterGoal} onChange={e => set('dailyWaterGoal', e.target.value)} className="input-field" min="1" max="20" />
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="glass-card p-6 space-y-4">
        <h2 className="section-title flex items-center gap-2"><Lock size={18} className="text-red-500" /> Change Password</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showOld ? 'text' : 'password'} value={passwords.currentPassword} onChange={e => setPass('currentPassword', e.target.value)} className="input-field pr-10" />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={passwords.newPassword} onChange={e => setPass('newPassword', e.target.value)} className="input-field pr-10" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
        <button type="submit" disabled={passLoading} className="btn-secondary flex items-center gap-2 text-sm">
          {passLoading ? <><Loader size={14} className="animate-spin" /> Changing...</> : <><Lock size={14} /> Change Password</>}
        </button>
      </form>
    </div>
  )
}
