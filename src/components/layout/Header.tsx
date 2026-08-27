import { useMemo } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Search, UserCircle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { vendorService } from '@/services/vendorService'
import { authService } from '@/services/authService'
import { toast } from 'sonner'

export const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname
  const { searchQuery, setSearchQuery, selectedDentist, selectedVendor } = useAppStore()

  const isDentistDetails = matchPath('/dentists/:id', pathname)
  const isVendorDetails = matchPath('/vendors/:id', pathname)
  const isDentistsPage = pathname === '/dentists' || !!isDentistDetails
  const isTechniciansPage = pathname === '/technicians'
  const isVendorsPage = pathname === '/vendors' || !!isVendorDetails
  const isInvoicesPage = pathname === '/invoices'
  const showSearch = isDentistsPage || isVendorsPage || isInvoicesPage || isTechniciansPage

  const headerContent = useMemo(() => {
    const handleVendorProductExport = async (vendorId: string) => {
      try {
        const blob = await vendorService.exportVendorProducts(vendorId, 'oldprice', 'DESC', searchQuery);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `vendor_products_${vendorId}_${new Date().getTime()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } catch (error) {
        console.error('Failed to export vendor products:', error);
      }
    }

    const searchInput = (
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4 group-focus-within:text-accent-primary transition-colors" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${isDentistsPage ? 'dentists' : isTechniciansPage ? 'technicians' : isVendorsPage ? 'vendors' : 'invoices'}...`} 
          className="bg-dark-elevated border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-accent-primary w-64 transition-all focus:w-80"
        />
      </div>
    )

    if (isDentistDetails) {
      return {
        left: (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dentists')}
              className="text-slate-500 hover:text-slate-900 hover:bg-dark-elevated"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              {selectedDentist?.name ? (
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedDentist.name}
                </h2>
              ) : (
                <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
              )}
            </div>
          </div>
        ),
        right: null
      }
    }

    if (isVendorDetails) {
      const vendorId = isVendorDetails.params.id || ''
      
      const handleImpersonate = async () => {
        if (!selectedVendor) return;
        try {
          const response = await authService.impersonate(selectedVendor.email);
          const impersonateLink = response.impersonateLink;

          if (impersonateLink) {
            window.open(impersonateLink, '_blank');
          } else {
            toast.error('Could not retrieve impersonate link');
          }
        } catch (error) {
          console.error('Impersonation failed:', error);
          toast.error('Impersonation process failed');
        }
      }

      return {
        left: (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/vendors')}
              className="text-slate-500 hover:text-slate-900 hover:bg-dark-elevated"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h3 className='text-xl font-bold text-slate-900'>
                {selectedVendor ? selectedVendor.fullName || selectedVendor.name : 'Vendor Details'}
              </h3>
              {selectedVendor && (
                <p className="text-sm text-slate-500">{selectedVendor.email}</p>
              )}
            </div>
          </div>
        ),
        right: (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleImpersonate}
                disabled={!selectedVendor}
                className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 h-10 gap-2"
              >
                <UserCircle className="h-4 w-4" />
                Impersonate
              </Button>
              <Button 
                onClick={() => handleVendorProductExport(vendorId)}
                className="bg-accent-primary hover:bg-accent-primary/80 text-white h-10"
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        )
      }
    }

    if (pathname === '/technicians/new') {
      return {
        left: (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/technicians')}
              className="text-slate-500 hover:text-slate-900 hover:bg-dark-elevated"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Technician</h2>
              <p className="text-sm text-slate-500 mt-0.5">Add a new company or individual technician to the system</p>
            </div>
          </div>
        ),
        right: null
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
    } else if (pathname === '/technicians/new') {
      title = 'Create New Technician'
      description = 'Add a new company or individual technician to the system'
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
          <h2 className='text-2xl font-bold text-slate-900'>{title}</h2>
          <p className='text-sm text-slate-500 mt-1'>{description}</p>
        </div>
      ),
      right: showSearch ? searchInput : null
    }
  }, [pathname, isDentistDetails, isVendorDetails, navigate, searchQuery, setSearchQuery, showSearch, isDentistsPage, isTechniciansPage, isVendorsPage, selectedDentist, selectedVendor])

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
