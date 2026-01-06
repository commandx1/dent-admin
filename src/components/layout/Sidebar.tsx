import { cn } from '@/lib/utils'
import { LayoutDashboard, UserRound, Settings, Store, FileText, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { authService } from '@/services/authService'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'dentists', label: 'Dentists', icon: UserRound, path: '/dentists' },
  { id: 'technicians', label: 'Technicians', icon: Settings, path: '/technicians' },
  { id: 'vendors', label: 'Vendors', icon: Store, path: '/vendors' },
  { id: 'invoices', label: 'Invoices', icon: FileText, path: '/invoices' }
] as const

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <aside className='group w-18 hover:w-64 bg-dark-surface border-r border-dark-elevated flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out z-50 overflow-hidden'>
      <div className='h-[88px] px-5 border-b border-dark-elevated flex items-center overflow-hidden'>
        <div className='flex items-center gap-4 shrink-0'>
          <div className='w-10 h-10 bg-linear-to-br from-gray-300 to-white rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-accent-primary/10'>
            <img src="/DentyProLogo.png" alt="DentyPro Logo" className='text-white h-6 w-6' />
          </div>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap'>
            <h1 className='text-lg font-bold text-slate-900 leading-none'>DentyPro Admin</h1>
            <p className='text-[10px] text-slate-500 mt-1 leading-none uppercase tracking-wider'>Management Panel</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 overflow-y-auto overflow-x-hidden p-3'>
        <div className='space-y-1.5'>
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => cn(
                  'w-full flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all duration-200 relative',
                  isActive 
                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20' 
                    : 'text-slate-500 hover:bg-dark-elevated hover:text-slate-900'
                )}
              >
                <Icon className='h-5 w-5 shrink-0' />
                <span className='font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div className='p-3 border-t border-dark-elevated'>
        <button
          onClick={handleLogout}
          className='w-full flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 group/logout'
        >
          <LogOut className='h-5 w-5 shrink-0' />
          <span className='font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
