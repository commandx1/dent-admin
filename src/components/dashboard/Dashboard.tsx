import { StatCard } from './StatCard'
import { AppointmentCard } from './AppointmentCard'
import { InvoiceTable } from './InvoiceTable'
import { CalendarCheck, PhoneCall, Video, ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/store/useStore'

export const Dashboard = () => {
  const { stats } = useDashboardStore()

  return (
    <div className='space-y-8'>
      {/* Stats Overview */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-white'>Service Analytics Overview</h3>
            <p className='text-sm text-gray-400 mt-1'>Current month performance metrics</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <StatCard
              title='Scheduled Appointments'
              value={stats.scheduled}
              icon={CalendarCheck}
              iconColor='bg-accent-primary/20'
              trend={{ value: '18.2%', isUp: true }}
              footerLabel='Completed'
              footerValue='298'
            />
            <StatCard
              title='Emergency Calls'
              value={stats.emergency}
              icon={PhoneCall}
              iconColor='bg-accent-danger/20'
              trend={{ value: '5.3%', isUp: false }}
              footerLabel='Avg Response Time'
              footerValue='12 min'
            />
            <StatCard
              title='Remote Consultations'
              value={stats.remote}
              icon={Video}
              iconColor='bg-accent-secondary/20'
              trend={{ value: '24.7%', isUp: true }}
              footerLabel='Avg Duration'
              footerValue='28 min'
            />
          </div>
        </div>
      </section>

      {/* Invoice Summary */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-white'>Invoice Summary</h3>
              <p className='text-sm text-gray-400 mt-1'>Current month financial overview</p>
            </div>
            <Button variant='link' className='text-accent-primary p-0 h-auto flex items-center gap-2'>
              View All Invoices <ArrowRight className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-warning'>
              <p className='text-gray-400 text-sm mb-2'>Pending</p>
              <p className='text-2xl font-bold text-white'>{stats.pendingInvoices}</p>
              <p className='text-sm text-gray-500 mt-1'>$38,450</p>
            </div>
            <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-success'>
              <p className='text-gray-400 text-sm mb-2'>Completed</p>
              <p className='text-2xl font-bold text-white'>{stats.completedInvoices}</p>
              <p className='text-sm text-gray-500 mt-1'>$124,560</p>
            </div>
            <div className='bg-dark-elevated rounded-lg p-4 border-l-4 border-accent-danger'>
              <p className='text-gray-400 text-sm mb-2'>Rejected</p>
              <p className='text-2xl font-bold text-white'>{stats.rejectedInvoices}</p>
              <p className='text-sm text-gray-500 mt-1'>$8,920</p>
            </div>
          </div>

          <InvoiceTable />
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section>
        <div className='bg-dark-surface border border-dark-elevated rounded-xl p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-white'>Upcoming Scheduled Appointments</h3>
              <p className='text-sm text-gray-400 mt-1'>Next 7 days overview</p>
            </div>
            <Button variant='link' className='text-accent-primary p-0 h-auto flex items-center gap-2'>
              View Calendar <Calendar className='h-4 w-4' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <AppointmentCard
              title='Routine Checkup'
              date='Tomorrow, Dec 10'
              time='8:00 AM'
              dentist='Dr. Sarah Mitchell'
              technician='John Smith'
              variant='primary'
            />
            <AppointmentCard
              title='Crown Installation'
              date='Tomorrow, Dec 10'
              time='10:30 AM'
              dentist='Dr. Michael Chen'
              technician='Robert Johnson'
              variant='secondary'
            />
            <AppointmentCard
              title='Implant Consultation'
              date='Dec 11'
              time='2:00 PM'
              dentist='Dr. Emily Rodriguez'
              technician='David Martinez'
              variant='success'
            />
          </div>
        </div>
      </section>
    </div>
  )
}
