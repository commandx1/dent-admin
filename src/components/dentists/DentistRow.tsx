import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import type { Dentist, SubDentist } from './types'
import { ChevronRight, ChevronDown, ExternalLink, Mail, Phone, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { technicianService } from '@/services/technicianService'

interface DentistRowProps {
  dentist: Dentist | SubDentist
  isSubItem?: boolean
}

export const DentistRow: React.FC<DentistRowProps> = ({ dentist, isSubItem = false }) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)

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

  const formattedLastLogin = dentist.lastLogin ? new Date(dentist.lastLogin).toLocaleString() : 'Never'

  const renderAvatar = () => {
    if (isPhotoLoading) {
      return (
        <div className='w-10 h-10 rounded-full bg-slate-200 animate-pulse border border-dark-border' />
      )
    }

    if (photo) {
      return (
        <div className='min-w-10 h-10 rounded-full border border-dark-border overflow-hidden'>
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
              {dentist.createdAt ? new Date(dentist.createdAt).toLocaleDateString() : '--'}
            </p>
          </div>
        </td>
        <td className='py-4 px-4'>
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
        </td>
      </tr>

      {/* Sub-dentists */}
      {isExpanded &&
        isMainDentist &&
        mainDentist.subDentists?.map(sub => <DentistRow key={sub.userId} dentist={sub} isSubItem />)}
    </>
  )
}
