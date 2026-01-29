import React,{ useState,useEffect } from 'react'
import { CAPABILITIES,type Company,type Employee } from './types'
import { Star,ChevronRight,ChevronDown,Building,User,UserPlus,Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AddEmployeeModal } from './AddEmployeeModal'
import { technicianService } from '@/services/technicianService'
import { Select } from '@/components/ui/select'
import { toast } from 'sonner'

interface TechnicianRowProps {
  item: Company | Employee
  isSubItem?: boolean
  onRefresh?: () => void
  parentCompany?: Company
}

export const TechnicianRow: React.FC<TechnicianRowProps> = ({ item,isSubItem = false, onRefresh, parentCompany }) => {
  const [isExpanded,setIsExpanded] = useState(false)
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isConfirmOpen,setIsConfirmOpen] = useState(false)
  const [pendingStatus,setPendingStatus] = useState<string | null>(null)
  const [photo,setPhoto] = useState<string | null>(null)
  const [isPhotoLoading,setIsPhotoLoading] = useState(false)
  const [isDeleting,setIsDeleting] = useState(false)

  // Type guards
  const isCompany = (obj: unknown): obj is Company => !!obj && typeof obj === 'object' && 'companyType' in obj

  const company = isCompany(item) ? (item as Company) : null
  const employee = !isCompany(item) ? (item as Employee) : null

  const userId = company ? company.ownerUserId : employee?.userId

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!userId || (company && company.companyType === 'corporate' && !isSubItem)) return

      try {
        setIsPhotoLoading(true)
        const photoBlob = await technicianService.getProfilePhoto(userId)
        if (photoBlob && photoBlob.size > 0) {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            // Remove the "data:application/octet-stream;base64," or similar prefix if present,
            // but for <img> src we can use the whole thing if it's already a data URL.
            // FileReader.readAsDataURL returns a string starting with "data:..."
            setPhoto(base64String)
          }
          reader.readAsDataURL(photoBlob)
        }
      } catch (error) {
        console.error('Error fetching profile photo:',error)
      } finally {
        setIsPhotoLoading(false)
      }
    }

    fetchPhoto()
  },[userId,company,isSubItem])

  const getInitialStatus = () => {
    if (isSubItem && employee) {
      return employee.accountStatus
    }
    if (company?.companyType === 'corporate') {
      return company.deleted === 'True' ? 'PASSIVE' : 'ACTIVE'
    }
    return item.ownerAccountStatus
  }

  const [currentStatus,setCurrentStatus] = useState(getInitialStatus())
  const isPending = currentStatus === 'PENDING'

  const handleStatusChange = async (newStatus: string) => {
    setPendingStatus(newStatus)
    setIsConfirmOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!pendingStatus) return
    const newStatus = pendingStatus
    try {
      if (company) {
        if (company.companyType === 'corporate') {
          // Update company status
          await technicianService.updateCompanyStatus(company.companyId, newStatus === 'ACTIVE')
          
          // Update all employees to match the new company status
          if (company.employees && company.employees.length > 0) {
            await Promise.all(
              company.employees.map(emp => 
                technicianService.updateTechnicianStatus(emp.userId, newStatus)
              )
            )
          }
        } else {
          const userId = company.ownerUserId
          if (!userId) return
          await technicianService.updateTechnicianStatus(userId, newStatus)
        }
      } else if (employee) {
        await technicianService.updateTechnicianStatus(employee.userId, newStatus)
        
        // If an employee is being activated but their parent company is inactive, activate the company too
        if (newStatus === 'ACTIVE' && parentCompany && parentCompany.deleted === 'True') {
          await technicianService.updateCompanyStatus(parentCompany.companyId, true)
        }

        // If an employee is being deactivated and all other employees are already inactive, deactivate the company too
        if (newStatus !== 'ACTIVE' && parentCompany && parentCompany.deleted === 'False') {
          const otherEmployeesActive = parentCompany.employees?.some(emp => 
            emp.userId !== employee.userId && emp.accountStatus === 'ACTIVE'
          )
          if (!otherEmployeesActive) {
            await technicianService.updateCompanyStatus(parentCompany.companyId, false)
          }
        }
      } else {
        return
      }

      setCurrentStatus(newStatus as 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'UNLOCKED' | 'PASSIVE' | 'REVOKED')
      onRefresh?.()
    } catch (error) {
      console.error('Failed to update status:',error)
    } finally {
      setIsConfirmOpen(false)
      setPendingStatus(null)
    }
  }

  const handleSoftDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const techId = company ? company.ownerTechnicianId : employee?.technicianId
    if (!techId) {
      toast.error('Technician ID not found')
      return
    }

    const isCurrentlyDeleted = company ? company.deleted === 'True' : employee?.deleted === 'True'
    
    try {
      setIsDeleting(true)
      await technicianService.updateSoftDeleteStatus(techId, isCurrentlyDeleted) // isCurrentlyDeleted true means we want to set isActive=1 (restore)
      toast.success(isCurrentlyDeleted ? 'Technician restored' : 'Technician deleted')
      onRefresh?.()
    } catch (error) {
      console.error('Soft delete failed:', error)
      toast.error('Action failed')
    } finally {
      setIsDeleting(false)
    }
  }

  const hasEmployees = company && company.employees && company.employees.length > 0
  const isCorporate = company?.companyType === 'corporate'
  const ownerFullName =
    company?.ownerFullName || [company?.ownerFirstName,company?.ownerLastName].filter(Boolean).join(' ')

  // Formatting for display
  const name = company
    ? company.companyName || ownerFullName
    : employee?.fullName || [employee?.firstName,employee?.lastName].filter(Boolean).join(' ')
  const type = company
    ? company.companyType === 'corporate'
      ? 'Company'
      : 'Individual'
    : employee?.isHeadquarters
      ? 'Admin'
      : 'User'
  const capabilities = company
    ? company.ownerCapabilityIds
    : employee?.ownerCapabilityIds || (employee as Employee & { capabilityIds?: number[] })?.capabilityIds || 0
  const capabilitiesNames = (capabilities || [])
    ?.map((capability: number) => CAPABILITIES.find(c => c.id === capability)?.label)
    .join(', ')
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
          <div className={cn('flex items-center gap-3',isSubItem && 'pl-4')}>
            {isCorporate && !isSubItem ? (
              <div className='min-w-10 max-w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30'>
                <Building className='h-5 w-5 text-accent-primary' />
              </div>
            ) : isPhotoLoading ? (
              <div className='min-w-10 max-w-10 h-10 rounded-full bg-slate-200 animate-pulse border border-dark-border' />
            ) : photo ? (
              <div className='min-w-10 max-w-10 h-10 rounded-full border border-dark-border overflow-hidden'>
                <img src={photo} alt={name || ''} className='w-full h-full object-contain' />
              </div>
            ) : (
              <div
                className={cn(
                  'min-w-10 max-w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border overflow-hidden',
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
              'px-2 py-1 rounded-full text-[10px] font-bold capitalize tracking-wider',
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
          <p className='text-slate-800 text-sm'>{email}</p>
          {phone && <p className='text-xs text-slate-500'>{phone}</p>}
        </td>
        <td className='py-4 px-4'>
          <p className='text-slate-800 text-sm'>{capabilitiesNames}</p>
        </td>
        <td className='py-4 px-4'>
          <p className='text-slate-800 font-semibold text-lg'>{totalJobs}</p>
          <p className='text-xs text-slate-500'>This month: {jobsThisMonth}</p>
        </td>
        <td className='py-4 px-4'>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-0.5'>
              {[...Array(5)].map((_,i) => {
                const isFull = i + 1 <= Math.floor(rating || 0)
                const isPartial = !isFull && i < (rating || 0)
                const partialWidth = isPartial ? `${((rating || 0) % 1) * 100}%` : '0%'

                return (
                  <div key={i} className='relative'>
                    {/* Bottom empty/gray star */}
                    <Star className='h-3.5 w-3.5 text-slate-300 fill-slate-300' />
                    {/* Top filled yellow star */}
                    {(isFull || isPartial) && (
                      <div
                        className='absolute inset-0 overflow-hidden'
                        style={{ width: isFull ? '100%' : partialWidth }}
                      >
                        <Star className='h-3.5 w-3.5 text-accent-warning fill-accent-warning' />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='text-slate-800 font-semibold text-sm'>{rating?.toFixed(1) || '0.0'}</span>
              <span className='text-[11px] text-slate-500 font-medium'>({ratingCount || 0} reviews)</span>
            </div>
          </div>
        </td>
        <td className='py-4 px-4'>
          <div 
            onClick={handleSoftDelete}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all border w-fit whitespace-nowrap',
              isDeleting 
                ? 'bg-slate-100 text-slate-400 border-slate-200' 
                : (company ? company.deleted === 'True' : employee?.deleted === 'True')
                  ? 'bg-accent-danger/10 text-accent-danger border-accent-danger/30 hover:bg-accent-danger/20'
                  : 'bg-accent-success/10 text-accent-success border-accent-success/30 hover:bg-accent-success/20'
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 className='h-3 w-3 animate-spin' />
                <span className="sr-only">Processing</span>
              </>
            ) : (
              (company ? company.deleted === 'True' : employee?.deleted === 'True') ? 'Deleted' : 'Active'
            )}
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-4'>
            {isPending ? (
              <div className='px-3 py-1 rounded-full text-xs font-medium bg-accent-warning/20 text-accent-warning border border-accent-warning/30 min-w-[85px] text-center'>
                Pending
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <Select
                  value={currentStatus === 'ACTIVE' ? 'ACTIVE' : 'PASSIVE'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={cn(
                    "w-32",
                    currentStatus === 'ACTIVE' ? "text-accent-success border-accent-success/30 bg-accent-success/10" : "text-accent-danger border-accent-danger/30 bg-accent-danger/10"
                  )}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PASSIVE">Inactive</option>
                </Select>
              </div>
            )}
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
      {isExpanded && company?.employees?.map(emp => <TechnicianRow key={emp.technicianId} item={emp} isSubItem onRefresh={onRefresh} parentCompany={company} />)}

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

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Are you sure?</h3>
              <p className="text-slate-500">
                Are you sure you want to change this technician's status to <strong>{pendingStatus === 'ACTIVE' ? 'Active' : 'Inactive'}</strong>?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
              <button
                onClick={() => {
                  setIsConfirmOpen(false)
                  setPendingStatus(null)
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors shadow-lg shadow-accent-primary/20"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
