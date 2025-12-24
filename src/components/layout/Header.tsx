import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export const Header = () => {
  const location = useLocation()
  const pathname = location.pathname

  const { title, description } = useMemo(() => {
    if (pathname === '/') {
      return {
        title: 'Dashboard Overview',
        description: "Welcome back! Here's what's happening today."
      }
    }

    if (pathname === '/dentists') {
      return {
        title: 'Dentists Management',
        description: 'Manage dentist profiles, locations, and activities'
      }
    }

    if (pathname === '/technicians') {
      return {
        title: 'Technicians Management',
        description: 'Manage company and individual technicians'
      }
    }

    if (pathname === '/vendors') {
      return {
        title: 'Vendors Management',
        description: 'Manage vendors, products, and inventory'
      }
    }

    if (pathname === '/invoices') {
      return {
        title: 'Invoices Management',
        description: 'Track, filter, and manage all invoices with detailed financial summaries'
      }
    }

    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.'
    }
  }, [pathname])
  return (
    <header className='h-[88px] bg-dark-surface border-b border-dark-elevated shrink-0 flex items-center'>
      <div className='px-6 w-full'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-white'>{title}</h2>
            <p className='text-sm text-gray-400 mt-1'>{description}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
