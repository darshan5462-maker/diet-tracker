import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, Edit2, Users, Check, X, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const ROLES = ['all', 'patient', 'doctor', 'admin']

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editUser, setEditUser] = useState(null)
  const limit = 12

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = { page, limit, search: search || undefined }
      if (roleFilter !== 'all') params.role = roleFilter
      const { data } = await api.get('/admin/users', { params })
      setUsers(data.users)
      setTotal(data.total)
    } catch { toast.error('Failed to fetch users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [page, roleFilter])
  useEffect(() => {
    const t = setTimeout(fetchUsers, 400)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch { toast.error('Failed to delete user') }
  }

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, { isActive: !user.isActive })
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`)
      fetchUsers()
    } catch { toast.error('Failed to update user') }
  }

  const handleUpdateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}`, { role })
      toast.success('Role updated')
      setEditUser(null)
      fetchUsers()
    } catch { toast.error('Failed to update role') }
  }

  const roleColors = {
    patient: 'badge-green', doctor: 'badge-blue', admin: 'badge-purple'
  }

  const pages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Users size={24} className="text-primary-500" /> User Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{total} total users in the system</p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10" placeholder="Search by name or email..." />
        </div>
        <div className="flex gap-2">
          {ROLES.map(role => (
            <button key={role} onClick={() => { setRoleFilter(role); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${roleFilter === role ? 'bg-primary-500 text-white shadow' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 skeleton rounded" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-16 text-center text-gray-400">No users found</td></tr>
              ) : users.map((user, i) => (
                <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : user.role === 'doctor' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-primary-500 to-teal-500'}`}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        {user.specialization && <p className="text-xs text-gray-400">{user.specialization}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-40 truncate">{user.email}</td>
                  <td className="px-4 py-3">
                    {editUser === user._id ? (
                      <select defaultValue={user.role} onChange={e => handleUpdateRole(user._id, e.target.value)}
                        className="input-field py-1 text-xs w-24">
                        {['patient', 'doctor', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span className={`badge text-xs capitalize ${roleColors[user.role] || 'badge-green'}`}>
                        {user.role === 'admin' && <Shield size={10} className="inline mr-1" />}
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(user)}
                      className={`badge text-xs cursor-pointer transition-all hover:opacity-80 ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                      {user.isActive ? <><Check size={10} className="inline mr-0.5" /> Active</> : <><X size={10} className="inline mr-0.5" /> Inactive</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditUser(editUser === user._id ? null : user._id)}
                        className={`p-1.5 rounded-lg transition-colors ${editUser === user._id ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}`}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(user._id, user.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500">Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-ghost p-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
              {[...Array(Math.min(pages, 5))].map((_, i) => {
                const p = i + 1
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-primary-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                    {p}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                className="btn-ghost p-2 disabled:opacity-40"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
