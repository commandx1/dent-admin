import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { Dentist, SubDentist } from './types'
import { ChevronRight, ChevronDown, ExternalLink, Mail, Phone, Calendar, Trash2, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { technicianService } from '@/services/technicianService'
import { dentistService } from '@/services/dentistService'
import { toast } from 'sonner'

interface DentistRowProps {
  dentist: Dentist | SubDentist
  isSubItem?: boolean
  onRefresh?: () => void
}

export const DentistRow: React.FC<DentistRowProps> = ({ dentist, isSubItem = false, onRefresh }) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!dentist.userId) return

      try {
        setIsPhotoLoading(true)
        const photoData = await technicianService.getProfilePhoto(dentist.userId)
        if (photoData) {
          if (typeof photoData === 'string') {
            const finalSrc = photoData.startsWith('data:') 
              ? photoData 
              : `data:image/jpeg;base64,${photoData}`
            setPhoto(finalSrc)
          } else if (photoData instanceof Blob) {
            const reader = new FileReader()
            reader.onloadend = () => {
              setPhoto(reader.result as string)
            }
            reader.readAsDataURL(photoData)
          }
        }
      } catch (error) {
        console.error('Error fetching dentist profile photo:', error)
      } finally {
        setIsPhotoLoading(false)
      }
    }

    fetchPhoto()
  }, [dentist.userId])

  // Type guard to check if it's a main Dentist or SubDentist
  const isMainDentist = 'companyName' in dentist
  const mainDentist = dentist as Dentist
  const hasSubDentists = isMainDentist && mainDentist.subDentists && mainDentist.subDentists.length > 0

  const formattedLastLogin = dentist.lastLogin ? new Date(dentist.lastLogin).toLocaleString('en-US', { timeZone: 'America/New_York' }) : 'Never'

  const renderAvatar = () => {
    if (isPhotoLoading) {
      return (
        <div className='min-w-10 h-10 rounded-full bg-slate-200 animate-pulse border border-dark-border' />
      )
    }

    if (photo) {
      return (
        <div className='min-w-10 max-w-10 h-10 rounded-full border border-dark-border overflow-hidden'>
          <img src={photo} alt={`${dentist.firstName} ${dentist.lastName}`} className='w-full h-full object-cover' />
        </div>
      )
    }

    if (dentist.profilePhotoData) {
      return (
        <div className='w-10 h-10 rounded-full border border-dark-border overflow-hidden'>
          <img 
            src={`data:image/png;base64,${dentist.profilePhotoData}`} 
            alt={`${dentist.firstName} ${dentist.lastName}`} 
            className='w-full h-full object-cover' 
          />
        </div>
      )
    }

    return (
      <div className='w-10 h-10 rounded-full bg-dark-elevated flex items-center justify-center border border-dark-border'>
        <span className='text-xs text-slate-400 font-bold'>
          {dentist.firstName[0]}{dentist.lastName[0]}
        </span>
      </div>
    )
  }

  const handleRowClick = () => {
    if (hasSubDentists) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleDelete = async () => {
    if (!dentist.userId) return

    try {
      setIsDeleting(true)
      await dentistService.deleteUser(dentist.userId)
      toast.success('Dentist deleted permanently')
      setIsDeleteConfirmOpen(false)
      onRefresh?.()
    } catch (error) {
      console.error('Delete dentist failed:', error)
      toast.error('Failed to delete dentist')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <tr
        className={cn(
          'border-b border-dark-border transition-all cursor-pointer',
          isSubItem ? 'bg-dark-elevated/20 border-l-4 border-l-accent-primary/50' : 'hover:bg-dark-elevated/50',
          isExpanded && 'bg-dark-elevated/30 border-l-4 border-l-accent-primary'
        )}
        onClick={handleRowClick}
      >
        <td className='py-4 px-4'>
          {hasSubDentists && (
            <button className='text-slate-500 hover:text-slate-900 transition-colors'>
              {isExpanded ? <ChevronDown className='h-5 w-5' /> : <ChevronRight className='h-5 w-5' />}
            </button>
          )}
        </td>
        <td className='py-4 px-4'>
          <div className={cn('flex items-center gap-3', isSubItem && 'pl-4')}>
            {renderAvatar()}
            <span className='text-slate-800 font-medium'>{dentist.firstName}</span>
          </div>
        </td>
        <td className='py-4 px-4 text-slate-700'>{dentist.lastName}</td>
        <td className='py-4 px-4'>
          {isMainDentist ? (
            <p className='text-slate-800 font-medium'>{mainDentist.companyName}</p>
          ) : (
            <p className='text-slate-800 font-medium'>{(dentist as SubDentist).locationName}</p>
          )}
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <Mail className='h-3.5 w-3.5 text-slate-400' />
            <a
              href={`mailto:${dentist.email}`}
              className='text-accent-primary hover:underline text-sm'
              onClick={e => e.stopPropagation()}
            >
              {dentist.email}
            </a>
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <Phone className='h-3.5 w-3.5 text-slate-400' />
            <span className='text-slate-700 text-sm'>{dentist.phone}</span>
          </div>
        </td>
        <td className='py-4 px-4'>
          {isMainDentist ? (
            <div className='flex items-center gap-2'>
              <span className='text-slate-700 font-semibold'>{mainDentist.locationCount}</span>
              {hasSubDentists && (
                <span className='text-[10px] bg-accent-primary/10 text-accent-primary px-1.5 py-0.5 rounded'>
                  {mainDentist.subDentists?.length} Subs
                </span>
              )}
            </div>
          ) : (
            <p className='text-slate-800 font-medium whitespace-break-spaces'>{(dentist as SubDentist).locationAddress}</p>
          )}
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-3.5 w-3.5 text-slate-400' />
            <p className='text-slate-800 text-sm'>{formattedLastLogin}</p>
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-3.5 w-3.5 text-slate-400' />
            <p className='text-slate-800 text-sm'>
              {dentist.createdAt ? new Date(dentist.createdAt).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : '--'}
            </p>
          </div>
        </td>
        <td className='py-4 px-4'>
          <div className='flex items-center gap-2'>
            <Button
              onClick={e => {
                e.stopPropagation()
                navigate(`/dentists/${dentist.userId}`)
              }}
              variant='outline'
              size='sm'
              className='bg-dark-elevated border-none hover:bg-dark-border text-slate-800 text-xs h-8'
            >
              <ExternalLink className='h-3 w-3 mr-1' /> View Details
            </Button>
            <button
              onClick={e => {
                e.stopPropagation()
                setIsDeleteConfirmOpen(true)
              }}
              className='p-2 hover:bg-accent-danger/10 text-slate-400 hover:text-accent-danger rounded-lg transition-colors group relative'
              title='Delete Dentist'
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Sub-dentists */}
      {isExpanded &&
        isMainDentist &&
        mainDentist.subDentists?.map(sub => <DentistRow key={sub.userId} dentist={sub} isSubItem onRefresh={onRefresh} />)}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-accent-danger">
                <Trash2 className="h-6 w-6" />
                <h3 className="text-xl font-bold text-slate-900">Permanent Delete</h3>
              </div>
              <p className="text-slate-500">
                Are you sure you want to permanently delete <strong>{dentist.firstName} {dentist.lastName}</strong>? This action cannot be undone and will remove all associated dentist data.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-danger text-white rounded-lg hover:bg-accent-danger/90 transition-colors shadow-lg shadow-accent-danger/20 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-3 w-3 animate-spin" />}
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
