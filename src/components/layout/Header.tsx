import { useMemo } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Download, MoreVertical, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { searchQuery, setSearchQuery } = useAppStore()

  const isDentistDetails = matchPath('/dentists/:id', pathname)
  const isVendorDetails = matchPath('/vendors/:id', pathname)
  const isDentistsPage = pathname === '/dentists' || !!isDentistDetails
  const isTechniciansPage = pathname === '/technicians'
  const isVendorsPage = pathname === '/vendors' || !!isVendorDetails
  const isInvoicesPage = pathname === '/invoices'
  const showSearch = isDentistsPage || isTechniciansPage || isVendorsPage || isInvoicesPage

  const searchInput = (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 group-focus-within:text-accent-primary transition-colors" />
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`Search ${isDentistsPage ? 'dentists' : isTechniciansPage ? 'technicians' : isVendorsPage ? 'vendors' : 'invoices'}...`} 
        className="bg-dark-elevated border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent-primary w-64 transition-all focus:w-80"
      />
    </div>
  )

  const headerContent = useMemo(() => {
    if (isDentistDetails) {
      // Mock data matching the details page
      const dentistId = isDentistDetails.params.id
      return {
        left: (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dentists')}
              className="text-gray-400 hover:text-white hover:bg-dark-elevated"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-white">Dr. Sarah Mitchell</h2>
              <p className="text-sm text-gray-400 mt-0.5">Smile Dental Clinic • ID: {dentistId}</p>
            </div>
          </div>
        ),
        right: (
          <div className="flex items-center gap-4">
            {searchInput}
            <div className="flex items-center gap-3 border-l border-dark-border pl-4">
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                Impersonate
              </Button>
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                <Mail className="h-4 w-4 mr-2" /> Send Email
              </Button>
              <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white h-10">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )
      }
    }

    if (isVendorDetails) {
      const vendorId = isVendorDetails.params.id
      return {
        left: (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/vendors')}
              className="text-gray-400 hover:text-white hover:bg-dark-elevated"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-white">Enis Atay</h2>
              <p className="text-sm text-gray-400 mt-0.5">Dental Supply Industry • ID: {vendorId}</p>
            </div>
          </div>
        ),
        right: (
          <div className="flex items-center gap-4">
            {searchInput}
            <div className="flex items-center gap-3 border-l border-dark-border pl-4">
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                Impersonate
              </Button>
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-white h-10">
                <Mail className="h-4 w-4 mr-2" /> Send Email
              </Button>
              <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white h-10">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )
      }
    }

    let title = 'Page Not Found'
    let description = 'The page you are looking for does not exist.'

    if (pathname === '/') {
      title = 'Dashboard Overview'
      description = "Welcome back! Here's what's happening today."
    } else if (pathname === '/dentists') {
      title = 'Dentists Management'
      description = 'Manage dentist profiles, locations, and activities'
    } else if (pathname === '/technicians') {
      title = 'Technicians Management'
      description = 'Manage company and individual technicians'
    } else if (pathname === '/vendors') {
      title = 'Vendors Management'
      description = 'Manage vendors, products, and inventory'
    } else if (pathname === '/invoices') {
      title = 'Invoices Management'
      description = 'Track, filter, and manage all invoices with detailed financial summaries'
    }

    return {
      left: (
        <div>
          <h2 className='text-2xl font-bold text-white'>{title}</h2>
          <p className='text-sm text-gray-400 mt-1'>{description}</p>
        </div>
      ),
      right: showSearch ? searchInput : null
    }
  }, [pathname, isDentistDetails, isVendorDetails, navigate, searchQuery, setSearchQuery, showSearch, isDentistsPage, isTechniciansPage, isVendorsPage, isInvoicesPage])

  return (
    <header className='h-[88px] bg-dark-surface border-b border-dark-elevated shrink-0 flex items-center'>
      <div className='px-6 w-full'>
        <div className='flex items-center justify-between'>
          {headerContent.left}
          {headerContent.right}
        </div>
      </div>
    </header>
  )
}
