import { useState, useEffect, useCallback } from 'react'
import { StatCard } from './StatCard'
import { AppointmentCard } from './AppointmentCard'
import { InvoiceTable } from './InvoiceTable'
import { CalendarCheck, PhoneCall, Video } from 'lucide-react'
import { appointmentService, type AppointmentStatistics, type ScheduledAppointment } from '@/services/appointmentService'
import { invoiceService } from '@/services/invoiceService'
import type { InvoiceStatistics } from '../invoices/types'

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
  const [appointmentStats, setAppointmentStats] = useState<AppointmentStatistics | null>(null)
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStatistics | null>(null)
  const [scheduledAppointments, setScheduledAppointments] = useState<ScheduledAppointment[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true)
  const [daysFromNow, setDaysFromNow] = useState(7)

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true)
      const [appData, invData] = await Promise.all([
        appointmentService.getStatistics(),
        invoiceService.getStatistics()
      ])
      setAppointmentStats(appData)
      setInvoiceStats(invData)
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchScheduled = useCallback(async () => {
    try {
      setIsLoadingAppointments(true)
      const data = await appointmentService.getScheduled(0, 10, daysFromNow)
      setScheduledAppointments(data.content)
    } catch (error) {
      console.error('Failed to fetch scheduled appointments:', error)
    } finally {
      setIsLoadingAppointments(false)
    }
  }, [daysFromNow])

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchScheduled()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchScheduled])

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
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-slate-800'>Invoice Summary</h3>
              <p className='text-sm text-slate-500 mt-1'>Current month financial overview</p>
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

      {/* Upcoming Appointments */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-slate-800'>Upcoming Scheduled Appointments</h3>
              <div className='flex items-center gap-2 mt-1'>
                <p className='text-sm text-slate-500'>Next</p>
                <input
                  type='number'
                  value={daysFromNow}
                  onChange={e => setDaysFromNow(parseInt(e.target.value) || 0)}
                  className='w-16 bg-dark-elevated border border-dark-border rounded px-2 py-0.5 text-sm text-slate-800 focus:outline-none focus:border-accent-primary'
                />
                <p className='text-sm text-slate-500'>days overview</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {isLoadingAppointments ? (
              <>
                <AppointmentCardSkeleton />
                <AppointmentCardSkeleton />
                <AppointmentCardSkeleton />
              </>
            ) : scheduledAppointments.length === 0 ? (
              <div className='col-span-full py-10 text-center text-slate-500 bg-dark-elevated rounded-xl border border-dark-border'>
                No upcoming appointments found for the next {daysFromNow} days.
              </div>
            ) : (
              scheduledAppointments.map(appointment => {
                const appointmentDate = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}Z`);
                
                const nyTime = appointmentDate.toLocaleTimeString('en-US', {
                  timeZone: 'America/New_York',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });

                const nyDate = appointmentDate.toLocaleDateString('en-US', {
                  timeZone: 'America/New_York',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                const nyCreatedAt = new Date(appointment.createdAt).toLocaleString('en-US', {
                  timeZone: 'America/New_York',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                });

                return (
                  <AppointmentCard
                    key={appointment.appointmentId}
                    title={appointment.description || 'No Description'}
                    description={appointment.locationAddress}
                    date={nyDate}
                    time={nyTime}
                    createdAt={nyCreatedAt}
                    dentist={appointment.organizerName}
                    technician={appointment.serviceProviderName}
                    variant='primary'
                  />
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
