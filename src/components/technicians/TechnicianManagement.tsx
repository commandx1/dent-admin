import { Users, Building, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Company, TechnicianStatistics } from './types'
import { TechnicianRow } from './TechnicianRow'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { technicianService } from '@/services/technicianService'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

const TechnicianRowSkeleton = () => (
  <tr className='border-b border-dark-border animate-pulse'>
    <td className='py-4 px-4'><div className='h-5 w-5 bg-slate-200 rounded mx-auto' /></td>
    <td className='py-4 px-4'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 rounded-full bg-slate-200' />
        <div className='h-4 w-32 bg-slate-200 rounded' />
      </div>
    </td>
    <td className='py-4 px-4'><div className='h-6 w-20 bg-slate-200 rounded-full' /></td>
    <td className='py-4 px-4'>
      <div className='space-y-2'>
        <div className='h-4 w-40 bg-slate-200 rounded' />
        <div className='h-3 w-24 bg-slate-200 rounded' />
      </div>
    </td>
    <td className='py-4 px-4'><div className='h-4 w-48 bg-slate-200 rounded' /></td>
    <td className='py-4 px-4'>
      <div className='space-y-2'>
        <div className='h-6 w-8 bg-slate-200 rounded' />
        <div className='h-3 w-16 bg-slate-200 rounded' />
      </div>
    </td>
    <td className='py-4 px-4'>
      <div className='space-y-2'>
        <div className='flex gap-1'><div className='w-3 h-3 bg-slate-200 rounded-full' /></div>
        <div className='h-4 w-20 bg-slate-200 rounded' />
      </div>
    </td>
    <td className='py-4 px-4'><div className='h-4 w-24 bg-slate-200 rounded-full' /></td>
    <td className='py-4 px-4'><div className='h-8 w-24 bg-slate-200 rounded-full' /></td>
  </tr>
)

interface TechnicianListProps {
  type: 'corporate' | 'individual'
  title: string
  icon: React.ElementType
}

const TechnicianList: React.FC<TechnicianListProps> = ({ type, title, icon: Icon }) => {
  const { searchQuery } = useAppStore()
  const [technicians, setTechnicians] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('companyName')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  useEffect(() => {
    let ignore = false
    const loadTechnicians = async () => {
      try {
        setIsLoading(true)
        const corporateValue = type === 'corporate' ? 1 : 0
        const data = await technicianService.getAll(currentPage, itemsPerPage, sortBy, sortDirection, searchQuery, corporateValue)
        if (!ignore) {
          setTechnicians(data.content)
          setTotalElements(data.totalElements)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        console.error(`Failed to fetch ${type} technicians:`, error)
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }
    const timer = setTimeout(() => {
      loadTechnicians()
    }, 500)
    return () => { 
      ignore = true 
      clearTimeout(timer)
    }
  }, [currentPage, itemsPerPage, sortBy, sortDirection, type, refreshKey, searchQuery])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortBy(field)
      setSortDirection('ASC')
    }
    setCurrentPage(0)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-bold text-slate-800 flex items-center gap-2'>
          <Icon className={cn('h-5 w-5', type === 'corporate' ? 'text-accent-primary' : 'text-accent-warning')} />
          {title}
          <span className='ml-2 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full'>
            {isLoading ? '...' : totalElements}
          </span>
        </h3>
      </div>
      <div className='bg-dark-surface border border-dark-border rounded-xl overflow-hidden min-h-[300px] relative'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-dark-elevated border-b border-dark-border'>
                <th className='w-10 py-4 px-4'></th>
                <th className='py-4 px-4 text-left'>
                  <SortButton 
                    label='Name' 
                    isActive={sortBy === 'companyName'}
                    direction={sortBy === 'companyName' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('companyName')}
                  />
                </th>
                <th className='py-4 px-4 text-left'>
                  <SortButton 
                    label='Type' 
                    isActive={sortBy === 'type'}
                    direction={sortBy === 'type' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('type')}
                  />
                </th>
                <th className='py-4 px-4 text-sm font-semibold text-slate-700 text-left'>Contact</th>
                <th className='py-4 px-4 text-sm font-semibold text-slate-700 text-left'>Capability</th>
                <th className='py-4 px-4 text-left'>
                  <SortButton 
                    label='Jobs Completed' 
                    isActive={sortBy === 'totalCompletedJobs'}
                    direction={sortBy === 'totalCompletedJobs' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('totalCompletedJobs')}
                  />
                </th>
                <th className='py-4 px-4 text-left'>
                  <SortButton 
                    label='Rating' 
                    isActive={sortBy === 'averageRating'}
                    direction={sortBy === 'averageRating' ? sortDirection.toLowerCase() as 'asc' | 'desc' : undefined}
                    onClick={() => handleSort('averageRating')}
                  />
                </th>
                <th className='py-4 px-4 text-sm font-semibold text-slate-700 text-left'>Deleted</th>
                <th className='py-4 px-4 text-sm font-semibold text-slate-700 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => <TechnicianRowSkeleton key={i} />)
              ) : technicians.length === 0 ? (
                <tr>
                  <td colSpan={9} className='py-20 text-center text-slate-500'>
                    No {type} technicians found
                  </td>
                </tr>
              ) : (
                    technicians.map(item => (
                      <TechnicianRow key={item.companyId} item={item} onRefresh={handleRefresh} />
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
          itemName={`${type} technicians`}
        />
      </div>
    </div>
  )
}

export const TechnicianManagement = () => {
  const [stats, setStats] = useState<TechnicianStatistics | null>(null)
  const [activeTab, setActiveTab] = useState<'corporate' | 'individual'>('corporate')
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false
    const loadStats = async () => {
      try {
        const statistics = await technicianService.getStatistics()
        if (!ignore) {
          setStats(statistics)
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      }
    }
    loadStats()
    return () => { ignore = true }
  }, [])

  return (
    <div className='space-y-8'>
      {/* Stats Cards */}
      <section id='technicians-stats'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatsCard
            title='Total Technicians'
            value={stats?.totalTechnicians.toString() || '0'}
            description='Registered companies/individuals'
            icon={Users}
            accentColor='secondary'
          />
          <StatsCard
            title='Corporate'
            value={stats?.totalCorporateCompanies.toString() || '0'}
            description='Multi-member companies'
            icon={Building}
            accentColor='primary'
          />
          <StatsCard
            title='Individual'
            value={stats?.totalIndividualCompanies.toString() || '0'}
            description='Single-member providers'
            icon={User}
            accentColor='warning'
          />
        </div>
      </section>

      <section id='technicians-actions' className='space-y-6'>
        <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
              {/* Tabs */}
              <div className='flex items-center bg-dark-elevated p-1 rounded-lg border border-dark-border'>
                <button
                  onClick={() => setActiveTab('corporate')}
                  className={cn(
                    'px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2',
                    activeTab === 'corporate' 
                      ? 'bg-white text-accent-primary shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <Building className='h-4 w-4' />
                  Company
                </button>
                <button
                  onClick={() => setActiveTab('individual')}
                  className={cn(
                    'px-6 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2',
                    activeTab === 'individual' 
                      ? 'bg-white text-accent-warning shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  <User className='h-4 w-4' />
                  Individual
                </button>
              </div>
            </div>
            
            <div className='flex items-center gap-3'>
              <Button
                onClick={() => navigate('/technicians/new')}
                className='bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2 h-11'
              >
                <Plus className='h-4 w-4 mr-2' /> New Technician
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Table section */}
      <section id='technicians-list'>
        <TechnicianList 
          key={activeTab}
          type={activeTab} 
          title={activeTab === 'corporate' ? "Corporate Technicians" : "Individual Technicians"} 
          icon={activeTab === 'corporate' ? Building : User} 
        />
      </section>
    </div>
  )
}
