import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Mail, Phone, Building, MapPin, Clock, CalendarPlus, CalendarCheck, PhoneCall, Video, User } from 'lucide-react'
import { dentistService } from '@/services/dentistService'
import type { Dentist } from './types'
import { useAppStore } from '@/store/useAppStore'
import { technicianService } from '@/services/technicianService'

export const DentistDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [dentist, setDentist] = useState<Dentist | null>(null)
  const [loading, setLoading] = useState(true)
  const [photo, setPhoto] = useState<string | null>(null)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const { setSelectedDentist } = useAppStore()

  useEffect(() => {
    if (id) {
      fetchDentistDetails(id)
    }
    return () => setSelectedDentist(null)
  }, [id, setSelectedDentist])

  const fetchPhoto = async (userId: string) => {
    try {
      setIsPhotoLoading(true)
      const photoData = await technicianService.getProfilePhoto(userId)
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

  const fetchDentistDetails = async (dentistId: string) => {
    setLoading(true)
    try {
      const data = await dentistService.getById(dentistId)
      setDentist(data)
      setSelectedDentist({
        name: `Dr. ${data.firstName} ${data.lastName}`,
        companyName: data.companyName
      })
      if (data.userId) {
        fetchPhoto(data.userId)
      }
    } catch (error) {
      console.error('Failed to fetch dentist details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <section id='profile-overview'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Sidebar Skeleton */}
            <div className='lg:col-span-1'>
              <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
                <div className='flex flex-col items-center'>
                  <div className='w-32 h-32 bg-slate-200 rounded-full mb-4' />
                  <div className='h-6 w-3/4 bg-slate-200 rounded mb-2' />
                  <div className='h-4 w-1/2 bg-slate-200 rounded mb-4' />
                  <div className='h-6 w-1/3 bg-slate-200 rounded-full mb-6' />
                  <div className='w-full space-y-3'>
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className='flex items-center gap-3'>
                        <div className='w-5 h-5 bg-slate-200 rounded' />
                        <div className='h-4 w-full bg-slate-200 rounded' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className='lg:col-span-3 space-y-6'>
              {/* Stats Cards Skeleton */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='bg-dark-surface border border-dark-border rounded-xl p-5'>
                    <div className='w-12 h-12 bg-slate-200 rounded-lg mb-3' />
                    <div className='h-4 w-1/2 bg-slate-200 rounded mb-2' />
                    <div className='h-8 w-1/3 bg-slate-200 rounded mb-2' />
                    <div className='h-3 w-1/4 bg-slate-200 rounded' />
                  </div>
                ))}
              </div>

              {/* Profile Info Skeleton */}
              <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
                <div className='flex items-center justify-between mb-6 border-b border-dark-border pb-4'>
                  <div className='space-y-2'>
                    <div className='h-6 w-48 bg-slate-200 rounded' />
                    <div className='h-4 w-64 bg-slate-200 rounded' />
                  </div>
                  <div className='h-10 w-24 bg-slate-200 rounded' />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mt-4'>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <div className='h-3 w-20 bg-slate-200 rounded' />
                      <div className='h-5 w-3/4 bg-slate-200 rounded' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!dentist) {
    return <div className='p-8 text-center text-red-500 text-lg'>Dentist not found.</div>
  }

  const renderAvatar = () => {
    if (isPhotoLoading) {
      return (
        <div className='w-32 h-32 rounded-full bg-slate-200 animate-pulse border-2 border-accent-primary/20 mb-4' />
      )
    }

    if (photo) {
      return (
        <img
          src={photo}
          alt={`Dr. ${dentist!.firstName} ${dentist!.lastName}`}
          className='min-w-32 h-32 rounded-full mb-4 object-cover border-2 border-accent-primary/20 shadow-lg'
        />
      )
    }

    if (dentist!.profilePhotoData) {
      return (
        <img
          src={`data:image/png;base64,${dentist!.profilePhotoData}`}
          alt={`Dr. ${dentist!.firstName} ${dentist!.lastName}`}
          className='min-w-32 h-32 rounded-full mb-4 object-cover border-2 border-accent-primary/20 shadow-lg'
        />
      )
    }

    return (
      <div className='w-32 h-32 rounded-full bg-dark-elevated flex items-center justify-center border-2 border-accent-primary/20 shadow-lg mb-4'>
        <User className='h-16 w-16 text-slate-400' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <section id='profile-overview'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Sidebar Info */}
          <div className='lg:col-span-1'>
            <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
              <div className='flex flex-col items-center'>
                {renderAvatar()}
                <h3 className='text-xl font-bold text-slate-900 mb-1 text-center'>
                  Dr. {dentist.firstName} {dentist.lastName}
                </h3>
                <p className='text-sm text-slate-500 mb-4 text-center'>{dentist.companyName}</p>
                <div className='w-full space-y-3'>
                  <div className='flex items-center gap-3 text-sm'>
                    <Mail className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700 truncate'>{dentist.email}</span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <Phone className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700'>{dentist.phone}</span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <Building className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700'>{dentist.companyName}</span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <MapPin className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700'>{dentist.locationCount} Locations</span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <Clock className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700'>Last login: {new Date(dentist.lastLogin).toLocaleString()}</span>
                  </div>
                  <div className='flex items-center gap-3 text-sm'>
                    <CalendarPlus className='text-slate-400 w-5 h-5 shrink-0' />
                    <span className='text-slate-700'>
                      Member since: {new Date(dentist.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-dark-surface border border-dark-border rounded-xl p-5'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center'>
                    <CalendarCheck className='text-accent-primary h-6 w-6' />
                  </div>
                </div>
                <h4 className='text-slate-500 text-sm mb-1'>Scheduled Appointments</h4>
                <p className='text-3xl font-bold text-slate-900'>{dentist.appointmentStats?.scheduleCount || 0}</p>
                <p className='text-xs text-slate-500 mt-2'>Total appointments</p>
              </div>
              <div className='bg-dark-surface border border-dark-border rounded-xl p-5'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='w-12 h-12 bg-accent-danger/20 rounded-lg flex items-center justify-center'>
                    <PhoneCall className='text-accent-danger h-6 w-6' />
                  </div>
                </div>
                <h4 className='text-slate-500 text-sm mb-1'>Emergency Calls</h4>
                <p className='text-3xl font-bold text-slate-900'>{dentist.appointmentStats?.emergencyCallCount || 0}</p>
                <p className='text-xs text-slate-500 mt-2'>Urgent requests</p>
              </div>
              <div className='bg-dark-surface border border-dark-border rounded-xl p-5'>
                <div className='flex items-center justify-between mb-3'>
                  <div className='w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center'>
                    <Video className='text-accent-secondary h-6 w-6' />
                  </div>
                </div>
                <h4 className='text-slate-500 text-sm mb-1'>Remote Consultations</h4>
                <p className='text-3xl font-bold text-slate-900'>
                  {dentist.appointmentStats?.remoteAssistanceCount || 0}
                </p>
                <p className='text-xs text-slate-500 mt-2'>Video assistance</p>
              </div>
            </div>

            {/* Profile Information */}
            <div className='bg-dark-surface border border-dark-border rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6 border-b border-dark-border pb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-slate-800'>Profile Information</h3>
                  <p className='text-sm text-slate-500 mt-1'>Detailed contact and location credentials</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mt-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    First Name
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.firstName}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Last Name
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.lastName}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Company Name
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.companyName}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Email Address
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.email}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Phone Number
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.phone}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Primary Address
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.address || '--'}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>City</label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.city || '--'}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>State</label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.state || '--'}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    ZIP Code
                  </label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.zipCode || '--'}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>Country</label>
                  <p className='text-slate-800 font-medium text-base'>{dentist.country || '--'}</p>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider block'>
                    Registration Date
                  </label>
                  <p className='text-slate-800 font-medium text-base'>
                    {new Date(dentist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
