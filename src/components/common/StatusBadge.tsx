import React, { useState } from 'react'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface StatusBadgeProps {
  status: string
  type: StatusType
  icon?: LucideIcon
  onToggle?: (newStatus: string) => Promise<void> | void
  nextStatus?: string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type,
  icon: Icon,
  onToggle,
  nextStatus,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const typeStyles: Record<StatusType, string> = {
    success: 'bg-accent-success/20 text-accent-success hover:bg-accent-success/30',
    warning: 'bg-accent-warning/20 text-accent-warning hover:bg-accent-warning/30',
    danger: 'bg-accent-danger/20 text-accent-danger hover:bg-accent-danger/30',
    info: 'bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30',
    default: 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
  }

  const dotColors: Record<StatusType, string> = {
    success: 'bg-accent-success',
    warning: 'bg-accent-warning',
    danger: 'bg-accent-danger',
    info: 'bg-accent-primary',
    default: 'bg-gray-400'
  }

  const handleClick = async (e: React.MouseEvent) => {
    if (!onToggle || isLoading) return
    e.stopPropagation()

    setIsLoading(true)
    // Simulating API call if not a promise
    const result = onToggle(nextStatus || status)
    if (result instanceof Promise) {
      await result
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !onToggle}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 transition-all w-fit min-w-[85px] justify-center',
        !isLoading ? typeStyles[type] : 'bg-dark-elevated text-gray-400 cursor-not-allowed hover:bg-dark-elevated',
        !onToggle && !isLoading && 'cursor-default hover:bg-opacity-20',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className='h-3 w-3 animate-spin' />
      ) : Icon ? (
        <Icon className='h-3 w-3' />
      ) : (
        <span className={cn('w-1.5 h-1.5 rounded-full shadow-sm', dotColors[type])}></span>
      )}
      {isLoading ? 'Updating...' : status}
    </button>
  )
}
