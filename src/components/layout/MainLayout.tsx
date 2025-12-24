import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen overflow-hidden bg-dark-bg text-gray-200'>
      <div className='flex-1 flex overflow-hidden'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header />
          <main className='flex-1 overflow-y-auto p-6'>
            <Outlet />
          </main>
        </div>
      </div>
      {/* <footer className='bg-dark-surface border-t border-dark-elevated px-6 py-3 shrink-0'>
        <div className='flex items-center justify-center text-sm text-gray-400'>
          <span>© 2024 DentzPro Admin Panel</span>
        </div>
      </footer> */}
    </div>
  )
}
