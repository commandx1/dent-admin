import {
  Store,
  Box,
  ShoppingCart,
  AlertTriangle,
  Link as LinkIcon,
  Import,
  Download,
  Eye,
} from 'lucide-react'
import { VendorRow } from './VendorRow'
import type { VendorAPIItem, VendorStatistics } from './types'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { useState, useEffect, useCallback } from 'react'
import { vendorService } from '@/services/vendorService'
import { useAppStore } from '@/store/useAppStore'
import { CreateSignupLinkModal } from './CreateSignupLinkModal'

const VendorRowSkeleton = () => (
  <tr className='animate-pulse border-b border-dark-border'>
    <td className='py-4 px-6'><div className='h-4 w-32 bg-slate-200 rounded' /></td>
    <td className='py-4 px-6'><div className='h-4 w-32 bg-slate-200 rounded' /></td>
    <td className='py-4 px-6'><div className='h-4 w-48 bg-slate-200 rounded' /></td>
    <td className='py-4 px-6'><div className='h-4 w-32 bg-slate-200 rounded' /></td>
    <td className='py-4 px-6'><div className='h-4 w-12 bg-slate-200 rounded mx-auto' /></td>
    <td className='py-4 px-6'><div className='h-4 w-12 bg-slate-200 rounded mx-auto' /></td>
    <td className='py-4 px-6'><div className='h-4 w-12 bg-slate-200 rounded mx-auto' /></td>
    <td className='py-4 px-6'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-6'><div className='h-4 w-20 bg-slate-200 rounded' /></td>
  </tr>
)

export const VendorManagement = () => {
  const [vendors, setVendors] = useState<VendorAPIItem[]>([])
  const [stats, setStats] = useState<VendorStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('createddate')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')
  const { searchQuery } = useAppStore()

  const fetchVendors = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await vendorService.getAll(currentPage, itemsPerPage, sortBy, sortDirection, searchQuery)
      setVendors(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection, searchQuery])

  const fetchStats = useCallback(async () => {
    try {
      const data = await vendorService.getStatistics()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch vendor statistics:', error)
    }
  }, [])

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVendors()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchVendors])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  const handleExport = async () => {
    try {
      const blob = await vendorService.export(sortBy, sortDirection, searchQuery);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `vendors_export_${new Date().getTime()}.xlsx`); // Assuming it's an excel file based on common practices
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Failed to export vendors:', error);
    }
  }

  return (
    <div className='space-y-8'>
      {/* Stats Cards */}
      <section id='vendor-stats'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <StatsCard 
            title="Total Vendors"
            value={stats?.totalVendors.toString() || '0'}
            description={`${stats?.lockedVendors || 0} locked vendors`}
            icon={Store}
            accentColor="warning"
          />
          <StatsCard 
            title="Total Products"
            value={stats?.totalProducts.toLocaleString() || '0'}
            description={`${stats?.activeProducts || 0} active, ${stats?.inactiveProducts || 0} inactive`}
            icon={Box}
            accentColor="primary"
          />
          <StatsCard 
            title="Total Sales"
            value={stats?.totalSales.toLocaleString() || '0'}
            description="Total sales count"
            icon={ShoppingCart}
            accentColor="success"
          />
          <StatsCard 
            title="Low Stock Alert"
            value={stats?.lowStockProducts.toString() || '0'}
            description="Products below threshold"
            icon={AlertTriangle}
            accentColor="danger"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section id='vendor-actions'>
        <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-slate-800'>Quick Actions</h3>
              <p className='text-sm text-slate-500 mt-1'>Manage vendors and products efficiently</p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <button 
              onClick={() => setIsSignupModalOpen(true)}
              className='bg-linear-to-br from-accent-primary to-accent-primary/80 hover:from-accent-primary/90 hover:to-accent-primary/70 text-white rounded-lg p-4 flex items-center gap-3 transition-all group'
            >
              <div className='w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center'>
                <LinkIcon className='h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Create Signup Link</p>
                <p className='text-xs opacity-90'>Generate vendor registration</p>
              </div>
            </button>
            <button className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-slate-800 rounded-lg p-4 flex items-center gap-3 transition-all'>
              <div className='w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center'>
                <Import className='text-accent-secondary h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Import Products</p>
                <p className='text-xs text-slate-500'>Upload Excel/CSV</p>
              </div>
            </button>
            <button 
              onClick={handleExport}
              className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-slate-800 rounded-lg p-4 flex items-center gap-3 transition-all'
            >
              <div className='w-12 h-12 bg-accent-success/20 rounded-lg flex items-center justify-center'>
                <Download className='text-accent-success h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Export Data</p>
                <p className='text-xs text-slate-500'>Download vendor list</p>
              </div>
            </button>
            <button className='bg-dark-elevated hover:bg-dark-border border border-dark-border text-slate-800 rounded-lg p-4 flex items-center gap-3 transition-all'>
              <div className='w-12 h-12 bg-accent-warning/20 rounded-lg flex items-center justify-center'>
                <Eye className='text-accent-warning h-6 w-6' />
              </div>
              <div className='text-left'>
                <p className='font-semibold'>Impersonate Vendor</p>
                <p className='text-xs text-slate-500'>View as vendor</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Vendor List */}
      <section id='vendor-list'>
        <div className='bg-dark-surface border border-dark-border rounded-xl overflow-hidden min-h-[400px] relative'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-dark-elevated border-b border-dark-border'>
                  <th className='py-4 px-6 text-left'>
                    <SortButton 
                      label="Vendor Name" 
                      isActive={sortBy === 'fullname'} 
                      direction={sortBy === 'fullname' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('fullname')}
                    />
                  </th>
                  <th className='py-4 px-6 text-left'>
                    <span className='text-sm font-semibold text-slate-700'>Full Name</span>
                  </th>
                  <th className='py-4 px-6 text-left'>
                    <span className='text-sm font-semibold text-slate-700'>Email</span>
                  </th>
                  <th className='py-4 px-6 text-left'>
                    <span className='text-sm font-semibold text-slate-700'>Phone</span>
                  </th>
                  <th className='py-4 px-6 text-center'>
                    <SortButton 
                      label="Total Products" 
                      isActive={sortBy === 'totalproducts'} 
                      direction={sortBy === 'totalproducts' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('totalproducts')}
                    />
                  </th>
                  <th className='py-4 px-6 text-center'>
                    <SortButton 
                      label="Active Products" 
                      isActive={sortBy === 'activeproducts'} 
                      direction={sortBy === 'activeproducts' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('activeproducts')}
                    />
                  </th>
                  <th className='py-4 px-6 text-center'>
                    <SortButton 
                      label="Sold Count" 
                      isActive={sortBy === 'totalsoldcount'} 
                      direction={sortBy === 'totalsoldcount' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('totalsoldcount')}
                    />
                  </th>
                  <th className='py-4 px-6 text-left'>
                    <SortButton 
                      label="Member Since" 
                      isActive={sortBy === 'createddate'} 
                      direction={sortBy === 'createddate' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                      onClick={() => handleSort('createddate')}
                    />
                  </th>
                  <th className='py-4 px-6 text-left'>
                    <span className='text-sm font-semibold text-slate-700'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-dark-border'>
                {isLoading ? (
                  [...Array(5)].map((_, i) => <VendorRowSkeleton key={i} />)
                ) : vendors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className='py-20 text-center text-slate-500'>
                      No vendors found
                    </td>
                  </tr>
                ) : (
                  vendors.map(vendor => (
                    <VendorRow key={vendor.id} vendor={vendor} />
                  ))
                )}
              </tbody>
            </table>
          </div>

        <TablePagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          totalItems={totalElements}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page - 1)}
          onItemsPerPageChange={setItemsPerPage}
          itemName="vendors"
        />
      </div>
    </section>

    <CreateSignupLinkModal 
      isOpen={isSignupModalOpen} 
      onClose={() => setIsSignupModalOpen(false)} 
    />
  </div>
)
}
