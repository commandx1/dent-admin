import { useState, useEffect, useCallback } from 'react'
import { Users, UserCheck, Building2, User } from 'lucide-react'
import { DentistRow } from './DentistRow'
import type { Dentist } from './types'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { dentistService } from '@/services/dentistService'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const DentistRowSkeleton = () => (
  <tr className='border-b border-dark-border animate-pulse'>
    <td className='py-4 px-4'><div className='h-5 w-5 bg-slate-200 rounded mx-auto' /></td>
    <td className='py-4 px-4'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-slate-200' />
        <div className='h-4 w-32 bg-slate-200 rounded' />
      </div>
    </td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-40 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-48 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-12 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'><div className='h-8 w-24 bg-slate-200 rounded-full' /></td>
  </tr>
)

export const DentistManagement = () => {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [roleStats, setRoleStats] = useState<{ dentistAdminCount: number; dentistManagerCount: number } | null>(null)
  const [currentPage, setCurrentPage] = useState(0) // API is 0-indexed
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const searchQuery = useAppStore(state => state.searchQuery)
  const [sortBy, setSortBy] = useState('lastLogin')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC')
  const [activeTab, setActiveTab] = useState<'clinics' | 'solo'>('clinics')

  const fetchDentists = useCallback(async () => {
    setLoading(true)
    try {
      const haveSubValue = activeTab === 'clinics' ? 1 : 0
      const data = await dentistService.getAll(currentPage, itemsPerPage, sortBy, sortDirection, searchQuery, haveSubValue)
      setDentists(data.content || [])
      setTotalElements(data.totalElements || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Failed to fetch dentists:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchQuery, sortBy, sortDirection, activeTab])

  useEffect(() => {
    setCurrentPage(0) // Reset to first page on search or tab change
  }, [searchQuery, activeTab])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await dentistService.getRoleStatistics()
        setRoleStats(stats)
      } catch (error) {
        console.error('Failed to fetch role statistics:', error)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDentists()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchDentists])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortDirection('DESC')
    }
    setCurrentPage(0)
  }

  return (
    <div className='space-y-8'>
      {/* Stats Section */}
      <section id='dentists-stats'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <StatsCard 
            title='Total Dentists'
            value={roleStats?.dentistAdminCount.toString() || '0'}
            description='Dentist Administrators'
            icon={Users}
            accentColor='primary'
          />
          <StatsCard 
            title='Total Managers'
            value={roleStats?.dentistManagerCount.toString() || '0'}
            description='Dentist Managers'
            icon={UserCheck}
            accentColor='success'
          />
        </div>
      </section>

      <section id='dentists-actions' className='space-y-6'>
        <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              {/* Tabs */}
              <div className='flex items-center bg-dark-elevated p-1 rounded-lg border border-dark-border'>
                <button
                  onClick={() => setActiveTab('clinics')}
                  className={cn(
                    'px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2',
                    activeTab === 'clinics' 
                      ? 'bg-white text-accent-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <Building2 className='h-4 w-4' />
                  Clinic
                </button>
                <button
                  onClick={() => setActiveTab('solo')}
                  className={cn(
                    'px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2',
                    activeTab === 'solo' 
                      ? 'bg-white text-accent-warning shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <User className='h-4 w-4' />
                  Individual
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section id='dentists-table'>
        <div className='bg-dark-surface border border-dark-border rounded-xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-dark-elevated border-b border-dark-border text-left'>
                  <th className='py-4 px-4'></th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>First Name</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Last Name</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Clinic / Status</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Email</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Phone</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Locations</th>
                  <th className='py-4 px-4'>
                    <SortButton 
                      label='Last Login' 
                      onClick={() => handleSort('lastLogin')}
                      isActive={sortBy === 'lastLogin'}
                      direction={sortBy === 'lastLogin' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    />
                  </th>
                  <th className='py-4 px-4'>
                    <SortButton 
                      label='Created At' 
                      onClick={() => handleSort('createdAt')}
                      isActive={sortBy === 'createdAt'}
                      direction={sortBy === 'createdAt' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    />
                  </th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-dark-border'>
                {loading ? (
                  [...Array(itemsPerPage)].map((_, i) => <DentistRowSkeleton key={i} />)
                ) : dentists.length === 0 ? (
                  <tr>
                    <td colSpan={10} className='py-10 text-center text-slate-500'>
                      No dentists found.
                    </td>
                  </tr>
                ) : (
                  dentists.map(dentist => (
                    <DentistRow key={dentist.userId} dentist={dentist} onRefresh={fetchDentists} />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && (
          <TablePagination
              currentPage={currentPage + 1}
              totalPages={totalPages}
              totalItems={totalElements}
            itemsPerPage={itemsPerPage}
              onPageChange={page => setCurrentPage(page - 1)}
            onItemsPerPageChange={setItemsPerPage}
              itemName='dentists'
          />
          )}
        </div>
      </section>
    </div>
  )
}
