import React, { useState } from 'react'
import type { Company, Employee } from './types'
import { Star, ChevronRight, ChevronDown, Building, User, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '../common/StatusBadge'
import { AddEmployeeModal } from './AddEmployeeModal'

interface TechnicianRowProps {
  item: Company | Employee
  isSubItem?: boolean
  onRefresh?: () => void
}

export const TechnicianRow: React.FC<TechnicianRowProps> = ({ item, isSubItem = false, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Type guards
  const isCompany = (obj: unknown): obj is Company => 
    !!obj && typeof obj === 'object' && 'companyType' in obj
  
  const company = isCompany(item) ? (item as Company) : null
  const employee = !isCompany(item) ? (item as Employee) : null

  const [isActive, setIsActive] = useState<boolean>(item.status === 'Active')

  const handleStatusToggle = () => {
    setIsActive(!isActive)
  }

  const hasEmployees = company && company.employees && company.employees.length > 0
  const isCorporate = company?.companyType === 'corporate'

  // Formatting for display
  const name = company ? company.companyName || company.ownerFullName || 'N/A' : employee?.fullName
  const type = company
    ? company.companyType === 'corporate'
      ? 'Company'
      : 'Individual'
    : employee?.isHeadquarters
      ? 'Admin'
      : 'User'
  const email = company ? company.ownerEmail : employee?.email
  const phone = company ? company.ownerTelephoneNumber : employee?.telephoneNumber
  const totalJobs = company ? company.companyJobStats.totalCompletedJobs : employee?.jobStats.totalCompletedJobs
  const jobsThisMonth = company
    ? company.companyJobStats.last30DaysCompletedJobs
    : employee?.jobStats.last30DaysCompletedJobs
  const rating = company ? company.companyRating.averageRating : employee?.rating.averageRating
  const ratingCount = company ? company.companyRating.totalRatingCount : employee?.rating.totalRatingCount

  return (
    <>
      <tr
        className={cn(
          'border-b border-dark-border transition-all cursor-pointer relative',
          isSubItem ? 'bg-dark-elevated/20 border-l-4 border-l-accent-primary/50' : 'hover:bg-dark-elevated/50',
          isExpanded && 'bg-dark-elevated/30 border-l-4 border-l-accent-primary'
        )}
        onClick={() => hasEmployees && setIsExpanded(!isExpanded)}
      >
        <td className='py-4 px-4 text-center'>
          {hasEmployees && (
            <button className='text-slate-500 hover:text-slate-900 transition-colors'>
              {isExpanded ? <ChevronDown className='h-5 w-5' /> : <ChevronRight className='h-5 w-5' />}
            </button>
          )}
        </td>
        <td className='py-4 px-4'>
          <div className={cn('flex items-center gap-3', isSubItem && 'pl-4')}>
            {isCorporate ? (
              <div className='w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30'>
                <Building className='h-5 w-5 text-accent-primary' />
              </div>
            ) : (
              <div
                className={cn(
                  'w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border overflow-hidden',
                  type === 'Admin'
                    ? 'border-accent-secondary/20 bg-accent-secondary/20'
                    : type === 'Individual'
                      ? 'border-accent-warning/20 bg-accent-warning/20'
                      : 'border-dark-border'
                )}
              >
                <User
                  className={`h-6 w-6 ${type === 'Admin' ? 'text-accent-secondary' : type === 'Individual' ? 'text-accent-warning' : 'text-slate-400'}`}
                />
              </div>
            )}
            <div>
              <p className='text-slate-800 font-medium'>{name}</p>
            </div>
          </div>
        </td>
        <td className='py-4 px-4'>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              company &&
                company.companyType === 'corporate' &&
                'bg-accent-primary/20 text-accent-primary border border-accent-primary/20',
              company &&
                company.companyType === 'individual' &&
                'bg-accent-warning/20 text-accent-warning border border-accent-warning/20',
              employee &&
                employee.isHeadquarters &&
                'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/20',
              employee && !employee.isHeadquarters && 'bg-dark-elevated text-slate-500 border border-dark-border'
            )}
          >
            {type}
          </span>
        </td>
        <td className='py-4 px-4'>
          <p className='text-slate-800 text-sm'>{email || 'N/A'}</p>
          {phone && <p className='text-xs text-slate-500'>{phone}</p>}
        </td>
        <td className='py-4 px-4'>
          <p className='text-slate-800 font-semibold text-lg'>{totalJobs}</p>
          <p className='text-xs text-slate-500'>This month: {jobsThisMonth}</p>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-1'>
            <Star className='h-4 w-4 text-accent-warning fill-accent-warning' />
            <span className='text-slate-800 font-medium'>{rating?.toFixed(1)}</span>
            <span className='text-xs text-slate-500'>({ratingCount})</span>
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-4'>
            <StatusBadge
              status={isActive ? 'Active' : 'Inactive'}
              type={isActive ? 'success' : 'danger'}
              onToggle={handleStatusToggle}
            />
            {isCorporate && !isSubItem && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  setIsModalOpen(true)
                }}
                className='p-2 hover:bg-accent-primary/10 text-accent-primary rounded-lg transition-colors group relative'
                title='Add Company User'
              >
                <UserPlus size={18} />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Sub Technicians Rows */}
      {isExpanded && company?.employees?.map(emp => <TechnicianRow key={emp.technicianId} item={emp} isSubItem />)}

      {/* Modal for adding company user */}
      {company && isCorporate && (
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          companyId={company.companyId}
          companyName={company.companyName}
          onSuccess={onRefresh}
        />
      )}
    </>
  )
}
