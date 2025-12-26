import { cn } from '@/lib/utils'
import { LayoutDashboard, UserRound, Settings, Store, FileText, Hospital } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: null, path: '/' },
  { id: 'dentists', label: 'Dentists', icon: UserRound, count: 248, path: '/dentists' },
  { id: 'technicians', label: 'Technicians', icon: Settings, count: 156, path: '/technicians' },
  { id: 'vendors', label: 'Vendors', icon: Store, count: 89, path: '/vendors' },
  { id: 'invoices', label: 'Invoices', icon: FileText, count: 342, path: '/invoices' }
] as const

export const Sidebar = () => {
  return (
    <aside className='group w-18 hover:w-64 bg-dark-surface border-r border-dark-elevated flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out z-50 overflow-hidden'>
      <div className='h-[88px] px-5 border-b border-dark-elevated flex items-center overflow-hidden'>
        <div className='flex items-center gap-4 shrink-0'>
          <div className='w-10 h-10 bg-linear-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-accent-primary/10'>
            <Hospital className='text-white h-6 w-6' />
          </div>
          <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap'>
            <h1 className='text-lg font-bold text-white leading-none'>DentyPro Admin</h1>
            <p className='text-[10px] text-gray-400 mt-1 leading-none uppercase tracking-wider'>Management Panel</p>
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
                    : 'text-gray-400 hover:bg-dark-elevated hover:text-white'
                )}
              >
                <Icon className='h-5 w-5 shrink-0' />
                <span className='font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100'>
                  {item.label}
                </span>
                {item.count && (
                  <span
                    className={cn(
                      'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150',
                      item.id === 'dentists' && 'bg-white/20 text-white',
                      item.id === 'technicians' && 'bg-white/20 text-white',
                      item.id === 'vendors' && 'bg-white/20 text-white',
                      item.id === 'invoices' && 'bg-white/20 text-white'
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
