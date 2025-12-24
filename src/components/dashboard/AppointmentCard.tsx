import { cn } from '@/lib/utils'
import { UserRound, Settings } from 'lucide-react'

interface AppointmentCardProps {
  title: string
  date: string
  time: string
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
  date,
  time,
  dentist,
  technician,
  variant
}: AppointmentCardProps) => {
  return (
    <div className={cn(
      "bg-dark-elevated rounded-lg p-4 border-l-4 border-dark-elevated",
      variants[variant].split(' ')[0]
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{date}</span>
        <span className={cn("px-2 py-1 text-xs rounded-full", variants[variant])}>
          {time}
        </span>
      </div>
      <h4 className="text-white font-medium mb-2">{title}</h4>
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
        <UserRound className="h-3 w-3" />
        <span>{dentist}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Settings className="h-3 w-3" />
        <span>{technician}</span>
      </div>
    </div>
  )
}
