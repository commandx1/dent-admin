import { useState,useEffect,useCallback,useMemo } from 'react'
import { StatCard } from './StatCard'
import { AppointmentCard } from './AppointmentCard'
import { InvoiceTable } from './InvoiceTable'
import { CalendarCheck,PhoneCall,Video,CheckCircle2,Clock,History } from 'lucide-react'
import { appointmentService,type AppointmentStatistics,type ScheduledAppointment,type IncompleteAppointment } from '@/services/appointmentService'
import { invoiceService } from '@/services/invoiceService'
import { technicianService } from '@/services/technicianService'
import type { InvoiceStatistics } from '../invoices/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const StatCardSkeleton = () => (
  <div className='bg-dark-elevated rounded-lg p-5 border border-dark-elevated animate-pulse'>
    <div className='flex items-center justify-between mb-3'>
      <div className='h-4 w-24 bg-slate-200 rounded' />
      <div className='w-10 h-10 rounded-lg bg-slate-200' />
    </div>
    <div className='h-8 w-16 bg-slate-200 rounded mb-2' />
    <div className='h-4 w-32 bg-slate-200 rounded mb-2' />
    <div className='mt-3 pt-3 border-t border-dark-elevated flex justify-between'>
      <div className='h-3 w-12 bg-slate-200 rounded' />
      <div className='h-3 w-8 bg-slate-200 rounded' />
    </div>
  </div>
)

const InvoiceStatSkeleton = () => (
  <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-slate-200 animate-pulse'>
    <div className='h-4 w-16 bg-slate-200 rounded mb-2' />
    <div className='h-8 w-12 bg-slate-200 rounded mb-1' />
    <div className='h-4 w-16 bg-slate-200 rounded' />
  </div>
)

const AppointmentCardSkeleton = () => (
  <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-slate-200 animate-pulse'>
    <div className='flex items-center justify-between mb-3'>
      <div className='h-3 w-20 bg-slate-200 rounded' />
      <div className='h-5 w-16 bg-slate-200 rounded-full' />
    </div>
    <div className='h-5 w-32 bg-slate-200 rounded mb-1' />
    <div className='h-3 w-48 bg-slate-200 rounded mb-3' />
    <div className='flex items-center gap-2 mb-1'>
      <div className='w-3 h-3 bg-slate-200 rounded-full' />
      <div className='h-3 w-24 bg-slate-200 rounded' />
    </div>
    <div className='flex items-center gap-2'>
      <div className='w-3 h-3 bg-slate-200 rounded-full' />
      <div className='h-3 w-20 bg-slate-200 rounded' />
    </div>
  </div>
)

export const Dashboard = () => {
  const [appointmentStats,setAppointmentStats] = useState<AppointmentStatistics | null>(null)
  const [invoiceStats,setInvoiceStats] = useState<InvoiceStatistics | null>(null)
  const [scheduledAppointments,setScheduledAppointments] = useState<ScheduledAppointment[]>([])
  const [incompleteAppointments,setIncompleteAppointments] = useState<IncompleteAppointment[]>([])
  const [technicians,setTechnicians] = useState<Array<{ id: string,name: string }>>([])
  const [isLoadingStats,setIsLoadingStats] = useState(true)
  const [isLoadingAppointments,setIsLoadingAppointments] = useState(true)
  const [daysFromNow,setDaysFromNow] = useState(7)
  const [invoiceDaysFromNow,setInvoiceDaysFromNow] = useState(30)

  const handleNumericInput = (value: string,setter: (val: number) => void) => {
    const numericValue = value.replace(/[^0-9]/g,'')
    setter(parseInt(numericValue) || 0)
  }

  const [activeTab,setActiveTab] = useState<'approved' | 'pending' | 'incomplete'>('approved')

  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true)
      const [appData,invData] = await Promise.all([
        appointmentService.getStatistics(),
        invoiceService.getStatistics(invoiceDaysFromNow)
      ])
      setAppointmentStats(appData)
      setInvoiceStats(invData)
    } catch (error) {
      console.error('Failed to fetch statistics:',error)
    } finally {
      setIsLoadingStats(false)
    }
  },[invoiceDaysFromNow])

  const fetchScheduled = useCallback(async () => {
    try {
      setIsLoadingAppointments(true)
      const data = await appointmentService.getScheduled(0,50,daysFromNow)
      setScheduledAppointments(data.content)
    } catch (error) {
      console.error('Failed to fetch scheduled appointments:',error)
    } finally {
      setIsLoadingAppointments(false)
    }
  },[daysFromNow])

  const fetchIncomplete = useCallback(async () => {
    try {
      setIsLoadingAppointments(true)
      const data = await appointmentService.getIncomplete(0,50)
      setIncompleteAppointments(data.content)
    } catch (error) {
      console.error('Failed to fetch incomplete appointments:',error)
    } finally {
      setIsLoadingAppointments(false)
    }
  },[])

  const fetchTechniciansList = useCallback(async () => {
    try {
      // Fetching a larger list to have options
      const data = await technicianService.getAll(0,100,'companyName','ASC')
      const formattedTechs: Array<{ id: string,name: string }> = []

      data.content.forEach(company => {
        if (company.companyType === 'individual') {
          // If it's an individual, add the owner
          if (company.ownerUserId && company.ownerAccountStatus === 'ACTIVE') {
            formattedTechs.push({
              id: company.ownerUserId,
              name: company.ownerFullName || [company.ownerFirstName,company.ownerLastName].filter(Boolean).join(' ') || company.companyName || 'Unknown Individual',
              // Keep company name for matching fallback
              companyName: company.companyName
            } as { id: string,name: string,companyName?: string })
          }
        } else if (company.companyType === 'corporate') {
          // If it's corporate, add only the employees
          if (company.employees) {
            company.employees.forEach(emp => {
              if (emp.accountStatus === 'ACTIVE') {
                formattedTechs.push({
                  id: emp.userId,
                  name: emp.fullName || [emp.firstName,emp.lastName].filter(Boolean).join(' ') || 'Unknown Employee'
                })
              }
            })
          }
        }
      })

      setTechnicians(formattedTechs)
    } catch (error) {
      console.error('Failed to fetch technicians list:',error)
    }
  },[])

  const handleTechnicianChange = async (appointmentId: string,newTechnicianId: string) => {
    try {
      await appointmentService.changeTechnician(appointmentId,newTechnicianId)
      toast.success('Technician updated successfully')
      if (activeTab === 'incomplete') {
        fetchIncomplete()
      } else {
        fetchScheduled()
      }
    } catch (error) {
      console.error('Failed to update technician:',error)
      toast.error('Failed to update technician')
    }
  }

  const handleUndoComplete = async (appointmentId: string) => {
    try {
      await appointmentService.markNotCompleted(appointmentId)
      toast.success('Appointment successfully undone')
      fetchIncomplete()
      fetchScheduled()
    } catch (error) {
      console.error('Failed to undo completion:',error)
      toast.error('Operation failed')
    }
  }

  const approvedAppointments = useMemo(() =>
    scheduledAppointments.filter(app => app.appointmentStatus === 'APPROVED'),
    [scheduledAppointments]
  )

  const pendingAppointments = useMemo(() =>
    scheduledAppointments.filter(app => app.appointmentStatus === 'PENDING'),
    [scheduledAppointments]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStats()
    },500)
    return () => clearTimeout(timer)
  },[fetchStats])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'incomplete') {
        fetchIncomplete()
      } else {
        fetchScheduled()
      }
    },500)
    return () => clearTimeout(timer)
  },[fetchScheduled,fetchIncomplete,activeTab])

  useEffect(() => {
    fetchTechniciansList()
  },[fetchTechniciansList])

  return (
    <div className='space-y-8'>
      {/* Stats Overview */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-slate-800'>Service Analytics Overview</h3>
            <p className='text-sm text-slate-500 mt-1'>Current performance metrics</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {isLoadingStats ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title='Scheduled Appointments'
                  value={appointmentStats?.totalScheduleAppointments || 0}
                  icon={CalendarCheck}
                  iconColor='bg-accent-primary/20'
                  footerLabel='Completed'
                  footerValue={appointmentStats?.completedScheduleAppointments || 0}
                />
                <StatCard
                  title='Emergency Calls'
                  value={appointmentStats?.totalEmergencyCallAppointments || 0}
                  icon={PhoneCall}
                  iconColor='bg-accent-danger/20'
                  footerLabel='Avg Response Time'
                  footerValue={`${appointmentStats?.averageResponseTimeMinutes?.toFixed(1) || 0} min`}
                />
                <StatCard
                  title='Remote Consultations'
                  value={appointmentStats?.totalRemoteAssistanceAppointments || 0}
                  icon={Video}
                  iconColor='bg-accent-secondary/20'
                  footerLabel='Avg Duration'
                  footerValue={`${appointmentStats?.averageDurationMinutes?.toFixed(1) || 0} min`}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Invoice Summary */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='flex items-center justify-between w-full mb-6'>
            <h3 className='text-lg font-semibold text-slate-800'>Invoice Summary</h3>
            <div className='flex items-center gap-2 mt-1'>
              <p className='text-sm text-slate-500'>Last</p>
              <input
                type='text'
                inputMode='numeric'
                value={invoiceDaysFromNow}
                onChange={e => handleNumericInput(e.target.value,setInvoiceDaysFromNow)}
                className='w-16 bg-dark-elevated border border-dark-border rounded px-2 py-0.5 text-sm text-slate-800 focus:outline-none focus:border-accent-primary text-center'
              />
              <p className='text-sm text-slate-500'>days overview</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            {isLoadingStats ? (
              <>
                <InvoiceStatSkeleton />
                <InvoiceStatSkeleton />
                <InvoiceStatSkeleton />
              </>
            ) : (
              <>
                <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-warning'>
                  <p className='text-slate-500 text-sm mb-2'>Pending</p>
                  <p className='text-2xl font-bold text-slate-900'>{invoiceStats?.pendingCount || 0}</p>
                  <p className='text-sm text-slate-500 mt-1'>${invoiceStats?.pendingTotalAmount.toLocaleString() || '0'}</p>
                </div>
                <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-success'>
                  <p className='text-slate-500 text-sm mb-2'>Completed</p>
                  <p className='text-2xl font-bold text-slate-900'>{invoiceStats?.approvedCount || 0}</p>
                  <p className='text-sm text-slate-500 mt-1'>${invoiceStats?.approvedTotalAmount.toLocaleString() || '0'}</p>
                </div>
                <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-danger'>
                  <p className='text-slate-500 text-sm mb-2'>Rejected</p>
                  <p className='text-2xl font-bold text-slate-900'>{invoiceStats?.rejectedCount || 0}</p>
                  <p className='text-sm text-slate-500 mt-1'>${invoiceStats?.rejectedTotalAmount.toLocaleString() || '0'}</p>
                </div>
              </>
            )}
          </div>

          <InvoiceTable />
        </div>
      </section>

      {/* Appointments Section */}
      <section className='space-y-6'>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='flex items-center justify-between w-full mb-6'>
            <h3 className='text-lg font-semibold text-slate-800'>Scheduled Appointments Overview</h3>
            <div className='flex items-center gap-2 mt-1'>
              <p className='text-sm text-slate-500'>Next</p>
              <input
                type='text'
                inputMode='numeric'
                value={daysFromNow}
                onChange={e => handleNumericInput(e.target.value,setDaysFromNow)}
                className='w-16 bg-dark-elevated border border-dark-border rounded px-2 py-0.5 text-sm text-slate-800 focus:outline-none focus:border-accent-primary text-center'
              />
              <p className='text-sm text-slate-500'>days overview</p>
            </div>
          </div>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
            {/* Tabs Trigger */}
            <div className='flex p-1 bg-dark-elevated rounded-lg self-start md:self-center'>
              <button
                onClick={() => setActiveTab('pending')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'pending'
                    ? 'bg-white text-accent-warning shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Clock className='w-4 h-4' />
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'approved'
                    ? 'bg-white text-accent-success shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <CheckCircle2 className='w-4 h-4' />
                Approved
              </button>
              <button
                onClick={() => setActiveTab('incomplete')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'incomplete'
                    ? 'bg-white text-accent-danger shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <History className='w-4 h-4' />
                In Complete
              </button>
            </div>
          </div>

          <div className='min-h-[300px]'>
            {isLoadingAppointments ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <AppointmentCardSkeleton />
                <AppointmentCardSkeleton />
                <AppointmentCardSkeleton />
              </div>
            ) : (activeTab === 'approved' ? approvedAppointments : activeTab === 'pending' ? pendingAppointments : incompleteAppointments).length === 0 ? (
              <div className='py-20 text-center text-slate-500 bg-dark-surface/50 rounded-xl border border-dark-border border-dashed'>
                No {activeTab} appointments found.
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {(activeTab === 'approved' ? approvedAppointments : activeTab === 'pending' ? pendingAppointments : incompleteAppointments).map(appointment => {
                  const appointmentDate = new Date(activeTab === 'incomplete'
                    ? (appointment as IncompleteAppointment).workStartDatetime
                    : `${(appointment as ScheduledAppointment).scheduledDate}T${(appointment as ScheduledAppointment).scheduledTime}Z`)

                  const nyTime = appointmentDate.toLocaleTimeString('en-US',{
                    timeZone: 'America/New_York',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })
                  const nyDate = appointmentDate.toLocaleDateString('en-US',{
                    timeZone: 'America/New_York',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  const nyCreatedAt = new Date(appointment.createdAt).toLocaleString('en-US',{
                    timeZone: 'America/New_York',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })

                  return (
                    <AppointmentCard
                      id={appointment.appointmentId}
                      key={appointment.appointmentId}
                      title={(appointment as ScheduledAppointment).description || (appointment as IncompleteAppointment).appointmentType || 'No Description'}
                      description={appointment.locationAddress}
                      date={nyDate}
                      time={nyTime}
                      workStartDatetime={activeTab === 'incomplete' ? (appointment as IncompleteAppointment).workStartDatetime : (appointment as ScheduledAppointment).workStartDatetime}
                      workEndDatetime={activeTab === 'incomplete' ? (appointment as IncompleteAppointment).workFinishDatetime : (appointment as ScheduledAppointment).workEndDatetime}
                      createdAt={nyCreatedAt}
                      dentist={appointment.organizerName}
                      technician={appointment.serviceProviderName}
                      technicianId={(appointment as ScheduledAppointment).serviceProviderId || technicians.find(t => t.name === appointment.serviceProviderName || (t as { companyName?: string }).companyName === appointment.serviceProviderName)?.id}
                      variant={activeTab === 'approved' ? 'success' : activeTab === 'pending' ? 'warning' : 'danger'}
                      technicianOptions={technicians}
                      onTechnicianChange={handleTechnicianChange}
                      onUndoComplete={activeTab === 'incomplete' ? handleUndoComplete : undefined}
                      onWorkDatetimeUpdate={activeTab === 'incomplete' ? fetchIncomplete : fetchScheduled}
                      showCreateInvoice={activeTab === 'incomplete'}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section >
    </div >
  )
}
