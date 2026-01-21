import { cn } from '@/lib/utils'
import { UserRound, Settings } from 'lucide-react'

interface AppointmentCardProps {
  title: string
  description?: string
  date: string
  time: string
  createdAt?: string
  dentist: string
  technician: string
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

const variants = {
  primary: "border-accent-primary bg-accent-primary/10 text-accent-primary",
  secondary: "border-accent-secondary bg-accent-secondary/10 text-accent-secondary",
  success: "border-accent-success bg-accent-success/10 text-accent-success",
  warning: "border-accent-warning bg-accent-warning/10 text-accent-warning",
  danger: "border-accent-danger bg-accent-danger/10 text-accent-danger",
}

export const AppointmentCard = ({
  title,
  description,
  date,
  time,
  createdAt,
  dentist,
  technician,
  variant
}: AppointmentCardProps) => {
  return (
    <div className={cn(
      "bg-dark-elevated rounded-lg p-4 border-l-4 border-dark-elevated flex flex-col h-full",
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
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
        <Settings className="h-3 w-3" />
        <span>{technician}</span>
      </div>
      {description && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{description}</p>}
      {createdAt && (
        <div className="mt-auto pt-3 border-t border-dark-border/50">
          <p className="text-[10px] text-slate-400">Created: {createdAt}</p>
        </div>
      )}
    </div>
  )
}
