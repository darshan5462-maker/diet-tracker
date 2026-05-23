import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleMobileSidebar, setMobileSidebar } from '../../store/slices/uiSlice'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({ role }) {
  const { mobileSidebarOpen } = useSelector(s => s.ui)
  const dispatch = useDispatch()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => dispatch(setMobileSidebar(false))}
        />
      )}

      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
