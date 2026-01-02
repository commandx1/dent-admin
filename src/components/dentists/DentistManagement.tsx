import { useState, useEffect, useCallback } from 'react'
import { Users, UserCheck, MapPin, Search, Filter, Download, Plus } from 'lucide-react'
import { DentistRow } from './DentistRow'
import type { Dentist } from './types'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { dentistService } from '@/services/dentistService'
import { Button } from '@/components/ui/button'

export const DentistManagement = () => {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0) // API is 0-indexed
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDentists = useCallback(async () => {
    setLoading(true)
    try {
      const data = await dentistService.getAll(currentPage, itemsPerPage, 'lastLogin', 'DESC', searchTerm)
      setDentists(data.content || [])
      setTotalElements(data.totalElements || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Failed to fetch dentists:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, searchTerm])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDentists()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchDentists])

  return (
    <div className='space-y-8'>
      {/* Stats Section */}
      <section id='dentists-stats'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatsCard
            title='Total Dentists'
            value={totalElements.toString()}
            description='Active accounts'
            icon={Users}
            accentColor='primary'
          />
          <StatsCard
            title='Active Members'
            value={totalElements.toString()}
            description='Total verified members'
            icon={UserCheck}
            accentColor='success'
          />
          <StatsCard
            title='Service Locations'
            value='--'
            description='Across all dentists'
            icon={MapPin}
            accentColor='warning'
          />
        </div>
      </section>

      {/* Actions & Filters */}
      <section id="dentists-actions">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or clinic..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 bg-dark-elevated border-none rounded-lg focus:ring-2 focus:ring-accent-primary/20 text-slate-800 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 px-4 py-2 h-10">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
              <Button variant="outline" className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 px-4 py-2 h-10">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white px-6 py-2 h-10">
                <Plus className="h-4 w-4 mr-2" /> Add Dentist
              </Button>
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
                  <th className='py-4 px-4'>
                    <SortButton label='First Name' />
                  </th>
                  <th className='py-4 px-4'>
                    <SortButton label='Last Name' />
                  </th>
                  <th className='py-4 px-4'>
                    <SortButton label='Clinic / Status' />
                  </th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Email</th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Phone</th>
                  <th className='py-4 px-4'>
                    <SortButton label='Locations' />
                  </th>
                  <th className='py-4 px-4'>
                    <SortButton label='Last Login' />
                  </th>
                  <th className='py-4 px-4 text-sm font-semibold text-slate-700'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-dark-border'>
                {loading ? (
                  <tr>
                    <td colSpan={8} className='py-10 text-center text-slate-500'>
                      Loading dentists...
                    </td>
                  </tr>
                ) : dentists.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='py-10 text-center text-slate-500'>
                      No dentists found.
                    </td>
                  </tr>
                ) : (
                  dentists.map(dentist => (
                    <DentistRow key={dentist.userId} dentist={dentist} />
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
