import { cn } from '@/lib/utils'
import { LayoutDashboard, UserRound, Settings, Store, FileText, MoreVertical, Hospital } from 'lucide-react'
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
    <aside className='w-64 bg-dark-surface border-r border-dark-elevated flex flex-col h-full shrink-0'>
      <div className='h-[88px] px-4 border-b border-dark-elevated flex items-center'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-linear-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center'>
            <Hospital className='text-white h-6 w-6' />
          </div>
          <div>
            <h1 className='text-lg font-bold text-white leading-none'>Dental Admin</h1>
            <p className='text-[10px] text-gray-400 mt-1 leading-none'>Management Panel</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 overflow-y-auto p-4'>
        <div className='space-y-1'>
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive ? 'bg-dark-elevated text-white' : 'text-gray-400 hover:bg-dark-elevated hover:text-white'
                )}
              >
                <Icon className='h-5 w-5' />
                <span className='font-medium'>{item.label}</span>
                {item.count && (
                  <span
                    className={cn(
                      'ml-auto text-xs px-2 py-1 rounded-full',
                      item.id === 'dentists' && 'bg-accent-primary/20 text-accent-primary',
                      item.id === 'technicians' && 'bg-accent-secondary/20 text-accent-secondary',
                      item.id === 'vendors' && 'bg-accent-warning/20 text-accent-warning',
                      item.id === 'invoices' && 'bg-accent-success/20 text-accent-success'
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
