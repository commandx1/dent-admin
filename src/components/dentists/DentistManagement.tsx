import { useState, useEffect, useCallback } from 'react'
import { Users, UserCheck, MapPin } from 'lucide-react'
import { DentistRow } from './DentistRow'
import { LocationModal } from './LocationModal'
import type { Dentist } from './types'
import { StatsCard } from '../common/StatsCard'
import { TablePagination } from '../common/TablePagination'
import { SortButton } from '../common/SortButton'
import { dentistService } from '@/services/dentistService'

export const DentistManagement = () => {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDentist, setSelectedDentist] = useState<Dentist | null>(null)
  const [currentPage, setCurrentPage] = useState(0) // API is 0-indexed
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchDentists = useCallback(async () => {
    setLoading(true)
    try {
      const data = await dentistService.getAll(currentPage, itemsPerPage)
      setDentists(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to fetch dentists:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    fetchDentists()
  }, [fetchDentists])

  const handleOpenLocations = (dentist: Dentist) => {
    setSelectedDentist(dentist)
    setIsModalOpen(true)
  }

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
                    <DentistRow key={dentist.userId} dentist={dentist} onOpenLocations={handleOpenLocations} />
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

      {selectedDentist && (
        <LocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} dentist={selectedDentist} />
      )}
    </div>
  )
}
