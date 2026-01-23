import { cn } from '@/lib/utils'
import { UserRound, Settings, Loader2, Edit2 } from 'lucide-react'
import { useState } from 'react'

interface TechnicianOption {
  id: string
  name: string
}

interface AppointmentCardProps {
  id: string
  title: string
  description?: string
  date: string
  time: string
  createdAt?: string
  dentist: string
  technician: string
  technicianId?: string
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  technicianOptions?: TechnicianOption[]
  onTechnicianChange?: (appointmentId: string, newTechnicianId: string) => Promise<void>
}

const variants = {
  primary: "border-accent-primary bg-accent-primary/10 text-accent-primary",
  secondary: "border-accent-secondary bg-accent-secondary/10 text-accent-secondary",
  success: "border-accent-success bg-accent-success/10 text-accent-success",
  warning: "border-accent-warning bg-accent-warning/10 text-accent-warning",
  danger: "border-accent-danger bg-accent-danger/10 text-accent-danger",
}

export const AppointmentCard = ({
  id,
  title,
  description,
  date,
  time,
  createdAt,
  dentist,
  technician,
  technicianId,
  variant,
  technicianOptions = [],
  onTechnicianChange
}: AppointmentCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTechId, setSelectedTechId] = useState(technicianId || '')
  const [isUpdating, setIsUpdating] = useState(false)

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

  return (
    <>
      <div className={cn(
        "bg-dark-elevated rounded-lg p-4 border-l-4 border-dark-elevated flex flex-col h-full relative group",
        variants[variant].split(' ')[0]
      )}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-500">{date}</span>
          <span className={cn("px-2 py-1 text-xs rounded-full", variants[variant])}>
            {time}
          </span>
        </div>
        <h4 className="text-slate-800 font-bold mb-1">{title}</h4>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1 mt-auto">
          <UserRound className="h-3 w-3" />
          <span>{dentist}</span>
        </div>
        
        <div className="flex items-center justify-between gap-2 text-sm text-slate-500 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <Settings className="h-3 w-3 shrink-0" />
            <span className="truncate">{technician}</span>
          </div>
          <button
            onClick={() => {
              setSelectedTechId(technicianId || '')
              setIsModalOpen(true)
            }}
            className="p-1 hover:bg-white/50 rounded transition-colors text-slate-400 hover:text-accent-primary"
            title="Update Technician"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{description}</p>}
        {createdAt && (
          <div className="mt-auto pt-3 border-t border-dark-border/50">
            <p className="text-[10px] text-slate-400">Created: {createdAt}</p>
          </div>
        )}
      </div>

      {/* Technician Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Update Technician</h3>
              <p className="text-sm text-slate-500 mb-4">Select a technician for this appointment</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Technician
                  </label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all appearance-none"
                    disabled={isUpdating}
                  >
                    <option value="">Select Technician</option>
                    {technicianOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 p-4 bg-slate-50">
              <button
                onClick={() => !isUpdating && setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !selectedTechId}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors shadow-lg shadow-accent-primary/20 disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-3 w-3 animate-spin" />}
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
