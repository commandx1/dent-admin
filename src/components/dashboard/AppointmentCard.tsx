import { cn } from '@/lib/utils'
import { UserRound, Settings, Loader2, Edit2, RotateCcw, AlertTriangle, FileText, Clock, MapPin, ArrowRight, CalendarClock } from 'lucide-react'
import { useState } from 'react'
import api from '@/lib/api'
import { appointmentService } from '@/services/appointmentService'
import { toast } from 'sonner'

interface TechnicianOption {
  id: string
  name: string
}

interface InvoicePreviewItem {
  product_id?: string
  custom_product_name: string
  quantity: number
  unit_price: number
}

interface InvoicePreviewResponse {
  appointment_id: string
  description: string
  items: InvoicePreviewItem[]
}

interface AppointmentCardProps {
  id: string
  title: string
  description?: string
  date: string
  time: string
  workStartDatetime?: string
  workEndDatetime?: string
  createdAt?: string
  dentist: string
  technician: string
  technicianId?: string
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  technicianOptions?: TechnicianOption[]
  onTechnicianChange?: (appointmentId: string, newTechnicianId: string) => Promise<void>
  onUndoComplete?: (appointmentId: string) => Promise<void>
  onWorkDatetimeUpdate?: (appointmentId: string) => Promise<void>
  showCreateInvoice?: boolean
}

const variantHoverBorder = {
  primary: 'hover:border-accent-primary/50',
  secondary: 'hover:border-accent-secondary/50',
  success: 'hover:border-accent-success/50',
  warning: 'hover:border-accent-warning/50',
  danger: 'hover:border-accent-danger/50'
}

const variantGradient = {
  primary: 'bg-gradient-to-r from-accent-primary/10 to-transparent',
  secondary: 'bg-gradient-to-r from-accent-secondary/10 to-transparent',
  success: 'bg-gradient-to-r from-accent-success/10 to-transparent',
  warning: 'bg-gradient-to-r from-accent-warning/10 to-transparent',
  danger: 'bg-gradient-to-r from-accent-danger/10 to-transparent'
}

const variantBadge = {
  primary: 'bg-accent-primary/20 text-accent-primary',
  secondary: 'bg-accent-secondary/20 text-accent-secondary',
  success: 'bg-accent-success/20 text-accent-success',
  warning: 'bg-accent-warning/20 text-accent-warning',
  danger: 'bg-accent-danger/20 text-accent-danger'
}

const variantIcon = {
  primary: 'text-accent-primary',
  secondary: 'text-accent-secondary',
  success: 'text-accent-success',
  warning: 'text-accent-warning',
  danger: 'text-accent-danger'
}

const formatWorkDatetime = (iso?: string) => {
  if (!iso) return null
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true })
  } catch {
    return null
  }
}

const formatWorkStartDisplay = (iso?: string) => {
  if (!iso) return null
  try {
    const d = new Date(iso)
    const date = d.toLocaleDateString('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', year: 'numeric' })
    const time = d.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true })
    return `${date}, ${time}`
  } catch {
    return null
  }
}

const NY_TZ = 'America/New_York'

/** ISO string → "YYYY-MM-DDTHH:mm" in America/New_York (for datetime-local display) */
const isoToDatetimeLocalNY = (iso: string): string => {
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: NY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(d)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {} as Record<string, string>)
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}

/** "YYYY-MM-DDTHH:mm" interpreted as America/New_York → ISO string */
const datetimeLocalNYToISO = (localStr: string): string => {
  const [datePart, timePart] = localStr.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [h, min] = timePart.split(':').map(Number)
  const probe = new Date(Date.UTC(y, m - 1, d, 12, 0))
  const nyParts = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(probe)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {} as Record<string, string>)
  const nyMins = parseInt(nyParts.hour, 10) * 60 + parseInt(nyParts.minute, 10)
  const offsetMins = 12 * 60 - nyMins
  const utcMs = Date.UTC(y, m - 1, d, 0, 0) + (h * 60 + min + offsetMins) * 60 * 1000
  return new Date(utcMs).toISOString()
}

export const AppointmentCard = ({
  id,
  title,
  description,
  date,
  time,
  workStartDatetime,
  workEndDatetime,
  createdAt,
  dentist,
  technician,
  technicianId,
  variant,
  technicianOptions = [],
  onTechnicianChange,
  onUndoComplete,
  onWorkDatetimeUpdate,
  showCreateInvoice = false
}: AppointmentCardProps) => {
  const workStart = formatWorkDatetime(workStartDatetime)
  const workEnd = formatWorkDatetime(workEndDatetime)
  const workStartDisplay = formatWorkStartDisplay(workStartDatetime)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUndoModalOpen, setIsUndoModalOpen] = useState(false)
  const [isWorkDatetimeModalOpen, setIsWorkDatetimeModalOpen] = useState(false)
  const [workStartInput, setWorkStartInput] = useState(
    workStartDatetime ? isoToDatetimeLocalNY(workStartDatetime) : ''
  )
  const [workEndInput, setWorkEndInput] = useState(
    workEndDatetime ? isoToDatetimeLocalNY(workEndDatetime) : ''
  )
  const [invoiceModalData, setInvoiceModalData] = useState<InvoicePreviewResponse | null>(null)
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false)
  const [selectedTechId, setSelectedTechId] = useState(technicianId || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUndoing, setIsUndoing] = useState(false)
  const [isUpdatingWorkDatetime, setIsUpdatingWorkDatetime] = useState(false)

  const handleUpdate = async () => {
    if (!onTechnicianChange || !selectedTechId || selectedTechId === technicianId) {
      setIsModalOpen(false)
      return
    }

    try {
      setIsUpdating(true)
      await onTechnicianChange(id, selectedTechId)
      setIsModalOpen(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUndo = async () => {
    if (!onUndoComplete) return

    try {
      setIsUndoing(true)
      await onUndoComplete(id)
      setIsUndoModalOpen(false)
    } finally {
      setIsUndoing(false)
    }
  }

  const openWorkDatetimeModal = () => {
    setWorkStartInput(workStartDatetime ? isoToDatetimeLocalNY(workStartDatetime) : '')
    setWorkEndInput(workEndDatetime ? isoToDatetimeLocalNY(workEndDatetime) : '')
    setIsWorkDatetimeModalOpen(true)
  }

  const handleSaveWorkDatetime = async () => {
    if (!workStartInput.trim() || !workEndInput.trim()) {
      toast.error('Please set both start and end time')
      return
    }
    const start = datetimeLocalNYToISO(workStartInput)
    const end = datetimeLocalNYToISO(workEndInput)
    if (new Date(start) >= new Date(end)) {
      toast.error('End time must be after start time')
      return
    }
    try {
      setIsUpdatingWorkDatetime(true)
      await appointmentService.updateWorkDatetime(id, {
        workStartDatetime: start,
        workFinishDatetime: end,
      })
      toast.success('Work period updated')
      setIsWorkDatetimeModalOpen(false)
      await onWorkDatetimeUpdate?.(id)
    } catch {
      toast.error('Failed to update work period')
    } finally {
      setIsUpdatingWorkDatetime(false)
    }
  }

  const handleCreateInvoice = async () => {
    if (!showCreateInvoice) return
    try {
      setIsInvoiceLoading(true)
      const { data } = await api.post<InvoicePreviewResponse>(
        '/api/dentypro/payment/invoice',
        {
          appointment_id: id,
          description,
          items: [
            {
              product_id: 'd2c31b7e-5f17-4d18-bcc8-1e4c6a7f29d8',
              custom_product_name: 'Toothbrush',
              quantity: 2,
              unit_price: 5.0
            },
            {
              custom_product_name: 'Whitening Gel',
              quantity: 1,
              unit_price: 40.0
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TECHNICIAN_USER_ACCESS_TOKEN}`,
            'X-Refresh-Token': import.meta.env.VITE_TECHNICIAN_USER_REFRESH_TOKEN
          }
        }
      )
      setInvoiceModalData(data)
    } catch {
      setInvoiceModalData(null)
    } finally {
      setIsInvoiceLoading(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'bg-white rounded-lg border border-slate-200 shadow-sm transition-all flex flex-col h-full',
          variantHoverBorder[variant]
        )}
      >
        {/* Header: badge, date, time */}
        <div className={cn('p-4 border-b border-slate-200', variantGradient[variant])}>
          <div className='flex items-center justify-between mb-2'>
            <span className={cn('px-2 py-1 text-xs rounded-full font-medium', variantBadge[variant])}>SCHEDULE</span>
            <div className='flex items-center gap-1'>
              <span className='text-xs text-slate-500'>{date}</span>
              {onUndoComplete && (
                <button
                  onClick={() => setIsUndoModalOpen(true)}
                  className='p-1 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-accent-danger'
                  title='Undo Completion'
                >
                  <RotateCcw className='h-3.5 w-3.5' />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedTechId(technicianId || '')
                  setIsModalOpen(true)
                }}
                className='p-1 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-accent-primary'
                title='Update Technician'
              >
                <Edit2 className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-slate-800 font-semibold'>
            <Clock className={cn('h-4 w-4', variantIcon[variant])} />
            <span>{time}</span>
          </div>
        </div>

        {/* Body: description, organizer, service provider, location, work period */}
        <div className='p-4 space-y-3'>
          <div>
            <p className='text-xs text-slate-500 mb-1'>Description</p>
            <p className='text-sm text-slate-800 font-medium'>{title}</p>
          </div>
          <div className='flex items-start gap-2'>
            <UserRound className={cn('h-3 w-3 shrink-0 mt-1 text-accent-primary')} />
            <div className='flex-1 min-w-0'>
              <p className='text-xs text-slate-500'>Organizer</p>
              <p className='text-sm text-slate-600'>{dentist}</p>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <Settings className={cn('h-3 w-3 shrink-0 mt-1 text-accent-secondary')} />
            <div className='flex-1 min-w-0'>
              <p className='text-xs text-slate-500'>Service Provider</p>
              <p className='text-sm text-slate-600'>{technician}</p>
            </div>
          </div>
          <div className='flex items-start gap-2'>
            <MapPin className={cn('h-3 w-3 shrink-0 mt-1 text-accent-warning')} />
            <div className='flex-1 min-w-0'>
              <p className='text-xs text-slate-500'>Location</p>
              <p className='text-sm text-slate-600'>{description || '—'}</p>
            </div>
          </div>

          <div className='pt-3 border-t border-slate-200'>
            <div className='flex items-center justify-between text-xs mb-1'>
              <span className='text-slate-500'>Work Period</span>
              <button
                type='button'
                onClick={openWorkDatetimeModal}
                className='p-1 hover:bg-slate-100 rounded transition-colors text-slate-500 hover:text-accent-success'
                title='Edit work period'
              >
                <CalendarClock className='h-3.5 w-3.5' />
              </button>
            </div>
            {(workStartDisplay != null || workEnd != null) ? (
              <div className='flex items-center gap-2'>
                <span className='text-xs text-accent-success font-medium'>{workStartDisplay ?? workStart ?? '—'}</span>
                <ArrowRight className='h-3 w-3 text-slate-400 shrink-0' />
                <span className='text-xs text-accent-success font-medium'>{workEnd ?? '—'}</span>
              </div>
            ) : (
              <button
                type='button'
                onClick={openWorkDatetimeModal}
                className='text-xs text-slate-500 hover:text-accent-success transition-colors'
              >
                Set work period
              </button>
            )}
          </div>

          {showCreateInvoice && (
            <button
              onClick={handleCreateInvoice}
              disabled={isInvoiceLoading}
              className='flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 text-sm font-medium transition-colors disabled:opacity-50'
            >
              {isInvoiceLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <FileText className='h-4 w-4' />}
              {isInvoiceLoading ? 'Loading...' : 'Create Invoice'}
            </button>
          )}
          {createdAt && (
            <div className='pt-3 border-t border-slate-200'>
              <p className='text-[10px] text-slate-500'>Created: {createdAt}</p>
            </div>
          )}
        </div>
      </div>

      {/* Technician Update Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200'>
            <div className='p-6'>
              <h3 className='text-lg font-bold text-slate-900 mb-1'>Update Technician</h3>
              <p className='text-sm text-slate-500 mb-4'>Select a technician for this appointment</p>

              <div className='space-y-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-slate-700 uppercase tracking-wider'>Technician</label>
                  <select
                    value={selectedTechId}
                    onChange={e => setSelectedTechId(e.target.value)}
                    className='w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all appearance-none'
                    disabled={isUpdating}
                  >
                    <option value=''>Select Technician</option>
                    {technicianOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 p-4 bg-slate-50'>
              <button
                onClick={() => !isUpdating && setIsModalOpen(false)}
                className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50'
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !selectedTechId}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors shadow-lg shadow-accent-primary/20 disabled:opacity-50'
              >
                {isUpdating && <Loader2 className='h-3 w-3 animate-spin' />}
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Undo Confirmation Modal */}
      {isUndoModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200'>
            <div className='p-6'>
              <div className='w-12 h-12 rounded-full bg-accent-danger/10 flex items-center justify-center mb-4'>
                <AlertTriangle className='h-6 w-6 text-accent-danger' />
              </div>
              <h3 className='text-lg font-bold text-slate-900 mb-1'>Mark as Incomplete</h3>
              <p className='text-sm text-slate-500 mb-4'>
                Are you sure you want to undo the completion of this appointment?
              </p>
            </div>

            <div className='flex items-center justify-end gap-3 p-4 bg-slate-50'>
              <button
                onClick={() => !isUndoing && setIsUndoModalOpen(false)}
                className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50'
                disabled={isUndoing}
              >
                Cancel
              </button>
              <button
                onClick={handleUndo}
                disabled={isUndoing}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-danger text-white rounded-lg hover:bg-accent-danger/90 transition-colors shadow-lg shadow-accent-danger/20 disabled:opacity-50'
              >
                {isUndoing && <Loader2 className='h-3 w-3 animate-spin' />}
                {isUndoing ? 'Processing...' : 'Yes, Undo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Period Edit Modal */}
      {isWorkDatetimeModalOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200'>
            <div className='p-6'>
              <h3 className='text-lg font-bold text-slate-900 mb-1'>Edit Work Period</h3>
              <p className='text-sm text-slate-500 mb-4'>Set start and end time (America/New_York)</p>
              <div className='space-y-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-slate-700 uppercase tracking-wider'>Start</label>
                  <input
                    type='datetime-local'
                    value={workStartInput}
                    onChange={e => setWorkStartInput(e.target.value)}
                    className='w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary'
                    disabled={isUpdatingWorkDatetime}
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-semibold text-slate-700 uppercase tracking-wider'>End</label>
                  <input
                    type='datetime-local'
                    value={workEndInput}
                    onChange={e => setWorkEndInput(e.target.value)}
                    className='w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary'
                    disabled={isUpdatingWorkDatetime}
                  />
                </div>
              </div>
            </div>
            <div className='flex items-center justify-end gap-3 p-4 bg-slate-50'>
              <button
                onClick={() => !isUpdatingWorkDatetime && setIsWorkDatetimeModalOpen(false)}
                className='px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50'
                disabled={isUpdatingWorkDatetime}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkDatetime}
                disabled={isUpdatingWorkDatetime || !workStartInput.trim() || !workEndInput.trim()}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-success text-white rounded-lg hover:bg-accent-success/90 transition-colors shadow-lg shadow-accent-success/20 disabled:opacity-50'
              >
                {isUpdatingWorkDatetime && <Loader2 className='h-3 w-3 animate-spin' />}
                {isUpdatingWorkDatetime ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {invoiceModalData && (
        <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200'>
            <div className='p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <FileText className='h-5 w-5 text-accent-primary' />
                <h3 className='text-lg font-bold text-slate-900'>Invoice Preview</h3>
              </div>
              <p className='text-sm text-slate-600 mb-1'>
                <span className='font-medium text-slate-700'>Appointment:</span> {invoiceModalData.appointment_id}
              </p>
              <p className='text-sm text-slate-600 mb-4'>
                <span className='font-medium text-slate-700'>Description:</span> {invoiceModalData.description || '—'}
              </p>
              <p className='text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2'>Items</p>
              <ul className='space-y-2 border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden'>
                {invoiceModalData.items.map((item, idx) => (
                  <li key={idx} className='flex items-center justify-between px-3 py-2 bg-slate-50/50 text-sm'>
                    <span className='text-slate-800'>{item.custom_product_name}</span>
                    <span className='text-slate-500'>
                      qty {item.quantity} × ${item.unit_price.toFixed(2)} = $
                      {(item.quantity * item.unit_price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex justify-end p-4 bg-slate-50'>
              <button
                onClick={() => setInvoiceModalData(null)}
                className='px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
